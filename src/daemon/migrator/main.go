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
	APIURL       = "http://api-entities:8080"
)

var entityPluralMap = map[string]string{
	"Team":        "teams",
	"Competition": "competitions",
	"Player":      "players",
}

type RabbitMQMessage struct {
	EntityName string          `json:"entity_name"`
	Data       json.RawMessage `json:"data"`
}

func checkError(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func callAPI(entity string, data interface{}) error {
	entityPlural, exists := entityPluralMap[entity]
	if !exists {
		return fmt.Errorf("Invalid entity: %s", entity)
	}

	resp, err := resty.R().
		SetHeader("Content-Type", "application/json").
		SetBody(data).
		Post(fmt.Sprintf("%s/%s", APIURL, entityPlural))

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

	messageStr := strings.TrimSpace(string(body))

	entityIndex := strings.Index(messageStr, entity)
	if entityIndex == -1 {
		log.Printf("Entity not found in the message. Skipping.")
		return nil
	}

	jsonStr := messageStr[entityIndex+len(entity):]

	jsonStart := strings.Index(jsonStr, "{")
	if jsonStart == -1 {
		log.Printf("JSON data not found in the message. Skipping.")
		return nil
	}

	jsonStr = jsonStr[jsonStart:]

	jsonEnd := strings.LastIndex(jsonStr, "}}")
	if jsonEnd == -1 {
		log.Printf("Invalid JSON format in the message. Skipping.")
		return nil
	}

	jsonStr = jsonStr[:jsonEnd+1]

	fmt.Printf("Extracted JSON string: %s\n", jsonStr)

	if strings.HasPrefix(jsonStr, "{") {
		err := json.Unmarshal([]byte(jsonStr), &data)
		if err != nil {
			log.Printf("Error extracting JSON data: %v. Skipping.", err)
			return nil
		}
	} else {
		data = jsonStr
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

		var rabbitMQMessage RabbitMQMessage
		err := json.Unmarshal(message.Body, &rabbitMQMessage)
		if err != nil {
			log.Printf("Error unmarshalling JSON message: %v. Skipping.", err)
			continue
		}

		entityData := extractEntityData(rabbitMQMessage.EntityName, message.Body)
		if entityData == nil {
			log.Printf("Error extracting entity data. Skipping.")
			continue
		}

		err = callAPI(rabbitMQMessage.EntityName, entityData)
		if err != nil {
			log.Printf("Error calling API to insert data: %v. Skipping.", err)
			continue
		}

		fmt.Println("Import task processed.")
	}
}
