package main

import (
	"database/sql"
	"encoding/json"
	"encoding/xml"
	"fmt"
	"log"

	_ "github.com/lib/pq"
	"github.com/streadway/amqp"
)

// Crossfit struct representa a estrutura geral dos dados
type Crossfit struct {
	Countries    []Country `xml:"Countries>Country"`
	Teams        []Team    `xml:"Teams>Team"`
	Competitions []Competition
}

// Team struct representa a tabela 'team'
type Team struct {
	ID      string   `xml:"id,attr" db:"id"`
	Name    string   `xml:"name,attr" db:"name"`
	Players []Player `xml:"Players>Player"`
}

// Player struct representa a tabela 'players'
type Player struct {
	ID              string `xml:"id,attr" db:"id"`
	Name            string `xml:"name,attr" db:"name"`
	LastName        string `xml:"last_name,attr" db:"last_name"`
	Gender          string `xml:"gender,attr" db:"gender"`
	Age             float64 `xml:"age,attr" db:"age"`
	Country         string `xml:"country,attr" db:"country"`
	CompetitorID    string `xml:"competitor_id,attr" db:"competitor_id"`
	CompetitorName  string `xml:"competitor_name,attr" db:"competitor_name"`
	Height          string `xml:"height,attr" db:"height"`
	Weight          string `xml:"weight,attr" db:"weight"`
	OverallRank     string `xml:"overall_rank,attr" db:"overall_rank"`
	OverallScore    string `xml:"overall_score,attr" db:"overall_score"`
	Year            string `xml:"year,attr" db:"year"`
	Competition     string `xml:"competition,attr" db:"competition"`
	HeightCm        string `xml:"height_cm,attr" db:"height_cm"`
	WeightKg        string `xml:"weight_kg,attr" db:"weight_kg"`
	TeamID          string `xml:"team_id,attr" db:"team_id"`
}

// Country struct representa a tabela 'countries'
type Country struct {
	ID        string `xml:"id,attr" db:"id"`
	Name      string `xml:"name,attr" db:"name"`
	Latitude  string `xml:"latitude,attr" db:"latitude"`
	Longitude string `xml:"longitude,attr" db:"longitude"`
	Teams     []Team `xml:"Teams>Team"`
}

// Competition struct representa a tabela 'competition'
type Competition struct {
	ID                string              `xml:"id,attr" db:"id"`
	Year              string              `xml:"year,attr" db:"year"`
	CompetitionName   string              `xml:"competition_name,attr" db:"competition_name"`
	CompetitionPlayers []CompetitionPlayer `xml:"CompetitionPlayers>CompetitionPlayer"`
}

// CompetitionPlayer struct representa a tabela 'competition_players'
type CompetitionPlayer struct {
	ID              string `xml:"id,attr" db:"id"`
	CompetitorID   string `xml:"competitor_id,attr" db:"competitor_id"`
	CompetitorName string `xml:"competitor_name,attr" db:"competitor_name"`
	OverallRank    string `xml:"overall_rank,attr" db:"overall_rank"`
	OverallScore   string `xml:"overall_score,attr" db:"overall_score"`
	CompetitionID  string `xml:"competition_id,attr" db:"competition_id"`
}

// Estrutura geral para enviar ao RabbitMQ
type RabbitMQMessage struct {
	EntityName string      `json:"entity_name"`
	Data       interface{} `json:"data"`
}

func sendMessageToBroker(entityName string, data interface{}, ch *amqp.Channel) bool {
	// Create the connection string
	connectionString := fmt.Sprintf("amqp://is:is@rabbitMQ:5672/is")

	// Create a new AMQP connection
	conn, err := amqp.Dial(connectionString)
	if err != nil {
		CheckError(err)
		return false
	}
	defer conn.Close()

	q, err := ch.QueueDeclare(
		"import_queue", // Queue name
		false,          // Durable
		false,          // Delete when unused
		false,          // Exclusive
		false,          // No-wait
		nil,            // Arguments
	)
	if err != nil {
		CheckError(err)
		return false
	}

	// Crie a mensagem a ser enviada ao RabbitMQ
	rabbitMQMessage := RabbitMQMessage{
		EntityName: entityName,
		Data:       data,
	}

	// Converta a mensagem para JSON
	messageBody, err := json.Marshal(rabbitMQMessage)
	if err != nil {
		CheckError(err)
		return false
	}

	err = ch.Publish(
		"",           // Exchange
		q.Name,       // Routing key
		false,        // Mandatory
		false,        // Immediate
		amqp.Publishing{
			ContentType: "application/json",
			Body:        messageBody,
		},
	)
	if err != nil {
		CheckError(err)
		return false
	}

	// Print success message
	fmt.Printf("Successfully sent message to RabbitMQ for entity: %s\n", entityName)
	return true
}

func checkUnmigratedFiles(db *sql.DB, ch *amqp.Channel) {
	fmt.Println("Checking for unmigrated files...")
	rows, err := db.Query("SELECT file_name, xml FROM public.imported_documents WHERE migrated = FALSE AND deleted = FALSE")
	CheckError(err)
	defer rows.Close()

	fmt.Println("Unmigrated Files:")
	for rows.Next() {
		var fileName, xmlData string
		err := rows.Scan(&fileName, &xmlData)
		CheckError(err)

		fmt.Printf("\nFile Name: %s\n", fileName)

		// Parse the XML data
		var crossfitData Crossfit
		err = xml.Unmarshal([]byte(xmlData), &crossfitData)
		if err != nil {
			fmt.Printf("Error unmarshalling XML for file %s: %v\n", fileName, err)
			continue
		}

		// Process the parsed data and send messages to the broker
		processAllData(crossfitData, ch)
	}
}

// processCountries processa as countries da estrutura Crossfit
func processCountries(countries []Country, ch *amqp.Channel) {
	for _, country := range countries {
		fmt.Printf("Country: %s\n", country.Name)
		// Enviar mensagem para o RabbitMQ para a country
		sendMessageToBroker("Country", country, ch)
	}
}

// processAllData processa todos os dados da estrutura Crossfit
func processAllData(crossfitData Crossfit, ch *amqp.Channel) {
	// Processar as countries separadamente
	processCountries(crossfitData.Countries, ch)

	// Processar as teams
	for _, team := range crossfitData.Teams {
		fmt.Printf("  Team: %s\n", team.Name)
		// Enviar mensagem para o RabbitMQ para a team
		sendMessageToBroker("Team", team, ch)

		for _, player := range team.Players {
			fmt.Printf("    Player: %s %s\n", player.Name, player.LastName)
			// Enviar mensagem para o RabbitMQ para o player
			sendMessageToBroker("Player", player, ch)
		}
	}

	// Processar as competitions
	for _, competition := range crossfitData.Competitions {
		fmt.Printf("  Competition: %s\n", competition.CompetitionName)
		// Enviar mensagem para o RabbitMQ para a competition
		sendMessageToBroker("Competition", competition, ch)

		for _, cp := range competition.CompetitionPlayers {
			fmt.Printf("    Competition Player: %s %s\n", cp.CompetitorName, cp.OverallRank)
			// Enviar mensagem para o RabbitMQ para o competition player
			sendMessageToBroker("CompetitionPlayer", cp, ch)
		}
	}
}

func CheckError(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func main() {
	fmt.Println("Connecting to db.... ")
	connStr := "host=db-xml user=is password=is dbname=is sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	CheckError(err)
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatal(err)
	}

	fmt.Println("\nSuccessfully connected to the database!")

	// Create a new AMQP connection
	conn, err := amqp.Dial("amqp://is:is@rabbitMQ:5672/is")
	CheckError(err)
	defer conn.Close()

	ch, err := conn.Channel()
	CheckError(err)
	defer ch.Close()

	// Check RabbitMQ connection and print success message
	if success := sendMessageToBroker("exampleCountry", Crossfit{}, ch); success {
		fmt.Println("RabbitMQ connection is successful!")
	} else {
		fmt.Println("Failed to send message to RabbitMQ")
	}

	checkUnmigratedFiles(db, ch)
}
