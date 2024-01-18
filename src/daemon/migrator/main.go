package main

import (
	"encoding/json"
	"fmt"
	"log"
	"strings"

	"github.com/streadway/amqp"
	"gopkg.in/resty.v1"
)

const (
	RabbitMQURL = "amqp://is:is@rabbitMQ:5672/is"
	ImportQueue  = "import_queue"
	APIURL       = "http://localhost:20001"
)

type Player struct {
	ID             string `json:"id"`
	Name           string `json:"name"`
	LastName       string `json:"last_name"`
	Gender         string `json:"gender"`
	Age            string `json:"age"`
	Country        string `json:"country"`
	CompetitorID   string `json:"competitor_id"`
	CompetitorName string `json:"competitor_name"`
	Height         string `json:"height"`
	Weight         string `json:"weight"`
	OverallRank    string `json:"overall_rank"`
	OverallScore   string `json:"overall_score"`
	Year           string `json:"year"`
	Competition    string `json:"competition"`
	HeightCm       string `json:"height_cm"`
	WeightKg       string `json:"weight_kg"`
	TeamID         string `json:"team_id"`
}

type Team struct {
	ID      string   `json:"id"`
	Name    string   `json:"name"`
	Players []Player `json:"players"`
}

type CompetitionPlayer struct {
	CompetitionsID string `json:"competitions_id"`
	CompetitorID   string `json:"competitor_id"`
	CompetitorName string `json:"competitor_name"`
	OverallRank    string `json:"overall_rank"`
	OverallScore   string `json:"overall_score"`
	CompetitionID  string `json:"competition_id"`
}

type Competition struct {
	ID                string              `json:"id"`
	Year              string              `json:"year"`
	CompetitionName   string              `json:"competition_name"`
	CompetitionPlayers []CompetitionPlayer `json:"competition_players"`
}

func checkError(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func callAPI(entity string, data interface{}) error {
	resp, err := resty.R().
		SetHeader("Content-Type", "application/json").
		SetBody(data).
		Post(fmt.Sprintf("%s/%s", APIURL, entity))

	if err != nil {
		return err
	}

	if resp.StatusCode() != 200 {
		return fmt.Errorf("API request failed with status code: %d", resp.StatusCode())
	}

	return nil
}

func extractEntityData(entity string, body []byte) interface{} {
	var data interface{}

	// Convert the message body to a string
	messageStr := string(body)

	// Remove leading and trailing whitespaces
	messageStr = strings.TrimSpace(messageStr)

	// Check if the message contains the entity name
	entityIndex := strings.Index(messageStr, entity)
	if entityIndex == -1 {
		log.Printf("Entity not found in the message. Skipping.")
		return nil
	}

	// Extract the JSON part of the message
	jsonStr := messageStr[entityIndex+len(entity):]

	// Unmarshal the JSON data
	err := json.Unmarshal([]byte(jsonStr), &data)
	if err != nil {
		log.Printf("Error extracting JSON data: %v. Skipping.", err)
		return nil
	}

	return data
}

func main() {
	fmt.Println("Migrator: Listening for import tasks...")

	connection, err := amqp.Dial(RabbitMQURL)
	checkError(err)
	defer connection.Close()

	channel, err := connection.Channel()
	checkError(err)
	defer channel.Close()

	queue, err := channel.QueueDeclare(
		ImportQueue,
		false,
		false,
		false,
		false,
		nil,
	)
	checkError(err)

	messages, err := channel.Consume(
		queue.Name,
		"",
		true,
		false,
		false,
		false,
		nil,
	)
	checkError(err)

	for message := range messages {
		fmt.Printf("Received import task: %s\n", message.Body)

		// Extract the entity and data from the message
		parts := strings.SplitN(string(message.Body), ":", 2)
		if len(parts) != 2 {
			log.Printf("Invalid message format. Skipping.")
			continue
		}

		entity := parts[0]
		entityData := extractEntityData(entity, []byte(parts[1]))
		if entityData == nil {
			log.Printf("Error extracting entity data. Skipping.")
			continue
		}

		// Call the API with the extracted entity data
		err := callAPI(entity, entityData)
		if err != nil {
			log.Printf("Error calling API: %v", err)
			// Handle the error as needed
		}

		fmt.Println("Import task processed.")
	}
}
