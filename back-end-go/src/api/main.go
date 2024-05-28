package main

import (
	"net/http"
	"strconv"
	"strings"

	"alforest.net/testdb"
	"alforest.net/umapsql"
	"github.com/gin-gonic/gin"
)

func main() {
	// Ginのデフォルトのルーターを作成
	router := gin.Default()

	// CORSミドルウェアを設定する
	router.Use(corsMiddleware())

	v1 := router.Group("/api/v1")
	{
		v1.POST("/user", addUser)
		v1.GET("/user", getUserByEmail)
		// 他の関連するエンドポイント...
		v1.GET("/card", getCard)
		v1.POST("/card", addCard)
		v1.PUT("/card", updateCard)
		v1.GET("/cards", getCardList)

		v1.GET("/deck", getDeckByDeckCode)
		v1.POST("/deck/regist", addDeck)
		v1.POST("/deck/get", getDeckDetailByDeckCode)
		v1.POST("/decks/get", getDeckListByOwner)
		v1.DELETE("/deck", deleteDeckByDeckCode)

		// テスト用
		// v1.POST("/testCreate", addTable)
		v1.GET("/ping", ping)
		v1.GET("/testdb", dbtest)
	}

	// 認証に成功した場合は、c.Next() を呼び出して次のハンドラに移動する
	// 認証に失敗した場合は、エラーレスポンスを返すなどの処理を行う
	// v1.Use(authMiddleware) // authMiddlewareをv1グループの全てのエンドポイントに適用

	// サーバを起動
	router.Run(":8081")
}

// CORSミドルウェアの定義
func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*") // すべてのオリジンからのリクエストを許可する場合
		// c.Writer.Header().Set("Access-Control-Allow-Origin", "http://example.com") // 特定のオリジンからのリクエストを許可する場合
		// 他の必要なCORSヘッダーも設定することができます

		if c.Request.Method == "OPTIONS" {
			c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
			c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")
			c.AbortWithStatus(200)
			return
		}

		c.Next()
	}
}

func ping(c *gin.Context) {
	c.String(200, "pong\n")
}

func dbtest(c *gin.Context) {
	c.String(200, testdb.Dbtest()+"\n")
}

// /////
func addUser(c *gin.Context) {
	resp := &umapsql.ApiResponse{
		Success: true,
		Message: "",
	}

	addUserData := &umapsql.User{
		Name:  "test2",
		Email: "test@test.com",
	}

	result, err := umapsql.AddUser(addUserData)
	resp.Data = result
	if err != nil {
		c.String(400, err.Error()+"\n")
	} else {
		c.JSON(http.StatusOK, resp.ToJson())
	}
}

func getUserByEmail(c *gin.Context) {
	resp := &umapsql.ApiResponse{
		Success: true,
		Message: "",
	}

	user := &umapsql.User{
		Email: "test@test.com",
	}

	// 	POST /person
	// Content-Type: application/json

	// {
	//     "name": "Alice",
	//     "age": 25
	// }

	// var person Person
	// if err := c.ShouldBindJSON(&person); err != nil {
	//     // エラーハンドリング
	// }

	resultUser, err := umapsql.GetUser(user)
	resp.Data = resultUser

	if err != nil {
		c.String(http.StatusBadRequest, err.Error()+"\n")
	} else {
		c.JSON(http.StatusOK, resp.ToJson())

		// .JSON(http.StatusOK, info.ToJson())
	}
}

func addCard(c *gin.Context) {
	resp := &umapsql.ApiResponse{
		Success: true,
		Message: "",
	}

	var addData umapsql.Card
	err := c.ShouldBindJSON(&addData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := umapsql.AddCard(&addData)
	resp.Data = result
	if err != nil {
		c.String(400, err.Error()+"\n")
	} else {
		c.JSON(http.StatusOK, resp.ToJson())
	}
}

func updateCard(c *gin.Context) {
	resp := &umapsql.ApiResponse{
		Success: true,
		Message: "",
	}

	var updateData umapsql.Card
	err := c.ShouldBindJSON(&updateData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := umapsql.UpdateCard(&updateData)
	resp.Data = result
	if err != nil {
		c.String(400, err.Error()+"\n")
	} else {
		c.JSON(http.StatusOK, resp.ToJson())
	}
}

func getCard(c *gin.Context) {
	resp := &umapsql.ApiResponse{
		Success: true,
		Message: "",
	}

	var card umapsql.Card

	idParam := c.Query("id")
	cardidParam := c.Query("card_id")
	if idParam != "" {
		intId, _ := strconv.ParseUint(idParam, 10, 32)
		card.ID = uint(intId)
	} else if cardidParam != "" {
		card.CardId = cardidParam
	}

	result, err := umapsql.GetCard(&card)
	resp.Data = result
	if err != nil {
		c.String(400, err.Error()+"\n")
	} else {
		c.JSON(http.StatusOK, resp.ToJson())
	}
}

func getCardList(c *gin.Context) {
	resp := &umapsql.ApiResponse{
		Success: true,
		Message: "",
	}

	classParam, _ := strconv.ParseUint(c.Query("class"), 10, 32)

	card := &umapsql.Card{
		ClassId: uint(classParam),
	}

	resultCardList, err := umapsql.GetCardList(card)
	resp.Data = resultCardList

	if err != nil {
		c.String(http.StatusBadRequest, err.Error()+"\n")
	} else {
		c.JSON(http.StatusOK, resp.ToJson())

		// .JSON(http.StatusOK, info.ToJson())
	}
}

// /////////////////////// deck
// deckView を受け取り、 deck と deckDetailの配列 を登録
func addDeck(c *gin.Context) {
	resp := &umapsql.ApiResponse{
		Success: true,
		Message: "",
	}

	var addData umapsql.DeckView
	// owner name outline deckkind を受け取る
	err := c.ShouldBindJSON(&addData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if strings.EqualFold(addData.EditType, "new") {
		result, err := umapsql.AddDeckAndDetail(&addData.Deck, &addData.DeckDetails)
		resp.Data = result
		if err != nil {
			c.String(400, err.Error()+"\n")
		} else {
			c.JSON(http.StatusOK, resp.ToJson())
		}
	} else if strings.EqualFold(addData.EditType, "edit") {
		result, err := umapsql.DeleteAndAddDeck(&addData.Deck, &addData.DeckDetails)
		resp.Data = result
		if err != nil {
			c.String(400, err.Error()+"\n")
		} else {
			c.JSON(http.StatusOK, resp.ToJson())
		}
	}
}

func updateDeck(c *gin.Context) {
	resp := &umapsql.ApiResponse{
		Success: true,
		Message: "",
	}

	var addData umapsql.Deck
	err := c.ShouldBindJSON(&addData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := umapsql.AddDeck(&addData)
	resp.Data = result
	if err != nil {
		c.String(400, err.Error()+"\n")
	} else {
		c.JSON(http.StatusOK, resp.ToJson())
	}
}

func getDeckDetailByDeckCode(c *gin.Context) {
	resp := &umapsql.ApiResponse{
		Success: true,
		Message: "",
	}

	var searchData umapsql.Deck
	err := c.ShouldBindJSON(&searchData)

	resultDeckDetailList, err := umapsql.GetDeckDetailByDeckCode(&searchData)
	resp.Data = resultDeckDetailList

	if err != nil {
		c.String(http.StatusBadRequest, err.Error()+"\n")
	} else {
		c.JSON(http.StatusOK, resp.ToJson())
	}
}

func getDeckListByOwner(c *gin.Context) {
	resp := &umapsql.ApiResponse{
		Success: true,
		Message: "",
	}

	var searchData umapsql.User
	err := c.ShouldBindJSON(&searchData)

	resultDecks, err := umapsql.GetDeckByOwner(&searchData)
	resp.Data = resultDecks

	if err != nil {
		c.String(http.StatusBadRequest, err.Error()+"\n")
	} else {
		c.JSON(http.StatusOK, resp.ToJson())
	}
}

func getDeckByDeckCode(c *gin.Context) {
	resp := &umapsql.ApiResponse{
		Success: true,
		Message: "",
	}

	var searchData umapsql.Deck

	dCodeParam := c.Query("deck_code")
	searchData.DeckCode = dCodeParam

	resultDeck, err := umapsql.GetDeckByDeckCode(&searchData)
	resp.Data = resultDeck

	if err != nil {
		c.String(http.StatusBadRequest, err.Error()+"\n")
	} else {
		c.JSON(http.StatusOK, resp.ToJson())
	}
}

func deleteDeckByDeckCode(c *gin.Context) {
	resp := &umapsql.ApiResponse{
		Success: true,
		Message: "",
	}

	var deleteData umapsql.Deck
	err := c.ShouldBindJSON(&deleteData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := umapsql.DeleteDeck(&deleteData)
	resp.Data = result
	if err != nil {
		c.String(400, err.Error()+"\n")
	} else {
		c.JSON(http.StatusOK, resp.ToJson())
	}
}
