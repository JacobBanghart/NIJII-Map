package main

import (
	"bytes"
	"encoding/json"
	"os"
)

func main() {
    dat, err := os.ReadFile("./Federal_American_Indian_Reservations_v1_-6588254737828329119.geojson")
	if err != nil {
		print(err)
		return
	}
	var pretty bytes.Buffer
	error := json.Indent(&pretty, dat, "", "    ")
	if error != nil {
		print(error)
		return
	}
	print(string(pretty.Bytes()))
    os.WriteFile("./Federal_American_Indian_Reservations_Formatted.geojson", pretty.Bytes(), 777)
}
