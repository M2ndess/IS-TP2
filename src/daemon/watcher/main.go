package main

import (
	"encoding/xml"
	"fmt"
	"io/ioutil"
	"log"
	"strings"
	"time"

	"github.com/streadway/amqp"
)

type Crossfit struct {
	Teams       []Team        `xml:"Teams>Team"`
	Players     []Player      `xml:"Players>Player"`
	Countries   []Country     `xml:"Countries>Country"`
	Competitions []Competition `xml:"Competitions>Competition"`
}

type Team struct {
	ID     string   `xml:"id,attr"`
	Name   string   `xml:"name,attr"`
	Players []Player `xml:"Players>Player"`
}

type Player struct {
	ID              string `xml:"id,attr"`
	Name            string `xml:"name,attr"`
	LastName        string `xml:"last_name,attr"`
	Gender          string `xml:"gender,attr"`
	Age             string `xml:"age,attr"`
	Country         string `xml:"country,attr"`
	CompetitorID    string `xml:"competitor_id,attr"`
	CompetitorName  string `xml:"competitor_name,attr"`
	Height          string `xml:"height,attr"`
	Weight          string `xml:"weight,attr"`
	OverallRank     string `xml:"overall_rank,attr"`
	OverallScore    string `xml:"overall_score,attr"`
	Year            string `xml:"year,attr"`
	Competition     string `xml:"competition,attr"`
	HeightCm        string `xml:"height_cm,attr"`
	WeightKg        string `xml:"weight_kg,attr"`
}

type Country struct {
	ID        string `xml:"id,attr"`
	Name      string `xml:"name,attr"`
	Latitude  string `xml:"latitude,attr"`
	Longitude string `xml:"longitude,attr"`
}

type Competition struct {
	ID              string            `xml:"id,attr"`
	Year            string            `xml:"year,attr"`
	CompetitionName string            `xml:"competition_name,attr"`
	CompetitionPlayers []CompetitionPlayer `xml:"CompetitionPlayers>CompetitionPlayer"`
}

type CompetitionPlayer struct {
	CompetitorID   string `xml:"competitor_id,attr"`
	CompetitorName string `xml:"competitor_name,attr"`
	OverallRank    string `xml:"overall_rank,attr"`
	OverallScore   string `xml:"overall_score,attr"`
}

func sayHelloWorld() {
	fmt.Println("Hello, World!!")
}

func getRabbitMQConnectionString() string {
	rabbitMQUsername := "is"
	rabbitMQPassword := "is"
	rabbitMQHost := "rabbitmq"
	rabbitMQPort := "5672"
	rabbitMQVHost := "is"

	connectionString := fmt.Sprintf("amqp://%s:%s@%s:%s/%s",
		rabbitMQUsername, rabbitMQPassword, rabbitMQHost, rabbitMQPort, rabbitMQVHost)

	return connectionString
}

func connectToRabbitMQ() (*amqp.Connection, *amqp.Channel, error) {
	conn, err := amqp.Dial(getRabbitMQConnectionString())
	if err != nil {
		return nil, nil, fmt.Errorf("Failed to connect to RabbitMQ: %v", err)
	}

	ch, err := conn.Channel()
	if err != nil {
		return nil, nil, fmt.Errorf("Failed to open a channel: %v", err)
	}

	return conn, ch, nil
}

func listXMLFilesAndSendToRabbitMQ() {
	files, err := ioutil.ReadDir("/xml")
	if err != nil {
		fmt.Printf("Error accessing /xml: %s\n", err)
		return
	}

	conn, ch, err := connectToRabbitMQ()
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()

	defer func() {
		if err := ch.Close(); err != nil {
			log.Printf("Error closing RabbitMQ channel: %v", err)
		}
	}()

	queueName := "xmlFiles"

	for _, f := range files {
		if strings.HasSuffix(f.Name(), ".xml") {
			fmt.Printf("\t> %s\n", f.Name())

			xmlData, err := ioutil.ReadFile("/xml/" + f.Name())
			if err != nil {
				log.Fatalf("Failed to read XML file %s: %v", f.Name(), err)
				continue
			}

			var crossfit Crossfit
			err = xml.Unmarshal(xmlData, &crossfit)
			if err != nil {
				log.Fatalf("Failed to unmarshal XML for file %s: %v", f.Name(), err)
				continue
			}

			err = ch.Publish(
				"",       // exchange
				queueName, // routing key
				false,    // mandatory
				false,    // immediate
				amqp.Publishing{
					ContentType: "text/plain",
					Body:        xmlData,
				})
			if err != nil {
				log.Fatalf("Failed to publish a message: %v", err)
			}
		}
	}
}

func main() {
	sayHelloWorld()
	listXMLFilesAndSendToRabbitMQ()
	time.Sleep(time.Second) // Espera um pouco para permitir o envio das mensagens para RabbitMQ
}
