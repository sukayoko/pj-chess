package umapsql

import (
	"log"
	"math/rand"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func connectDbWithDeck() (*gorm.DB, error) {
	dsn := "host=uma-postgres user=root password=secret dbname=umadb port=5432 sslmode=disable TimeZone=Asia/Tokyo"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	// このメソッドを実行すると構造体名がそのままテーブルとして利用される。しかしすべてに影響
	// db.SingularTable(true)

	// マイグレーション
	err = db.Table("deck").AutoMigrate(&Deck{})

	return db, err
}

func connectDbWithDeckDetail() (*gorm.DB, error) {
	dsn := "host=uma-postgres user=root password=secret dbname=umadb port=5432 sslmode=disable TimeZone=Asia/Tokyo"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	// このメソッドを実行すると構造体名がそのままテーブルとして利用される。しかしすべてに影響
	// db.SingularTable(true)

	// マイグレーション
	err = db.Table("deck_detail").AutoMigrate(&DeckDetail{})

	return db, err
}

// 作成
func AddDeck(addData *Deck) (bool, error) {
	var db, err = connectDbWithDeck()
	if err != nil {
		return false, err
	}

	result := db.Table("deck").Create(&addData)
	if result.Error != nil {
		return false, result.Error
	}

	closedb, _ := db.DB()
	defer closedb.Close()

	return true, err
}

// 取得
func GetDeckByOwner(searchData *User) ([]Deck, error) {
	var db, err = connectDbWithDeck()
	if err != nil {
		return nil, err
	}

	// データの取得
	deckList := []Deck{}
	var searchDeck Deck
	searchDeck.Owner = searchData.Email

	db.Table("deck").Where(&searchDeck).Order("created_at desc").Find(&deckList)

	closedb, _ := db.DB()
	defer closedb.Close()

	return deckList, err
}

// 取得
func GetDeckByDeckCode(searchData *Deck) (Deck, error) {
	// データの取得
	findDeck := Deck{}

	var db, err = connectDbWithDeck()
	if err != nil {
		return findDeck, err
	}

	db.Table("deck").Where(&searchData).Find(&findDeck)

	closedb, _ := db.DB()
	defer closedb.Close()

	return findDeck, err
}

// 取得
func GetDeckDetailByDeckCode(searchData *Deck) ([]DeckDetail, error) {
	var db, err = connectDbWithDeckDetail()
	if err != nil {
		return nil, err
	}

	// データの取得
	deckDetailList := []DeckDetail{}
	var searchDeckDetail DeckDetail
	searchDeckDetail.DeckCode = searchData.DeckCode

	db.Table("deck_detail").Where(&searchData).Find(&deckDetailList)

	closedb, _ := db.DB()
	defer closedb.Close()

	return deckDetailList, err
}

// 作成
func AddDeckAndDetail(addDeckData *Deck, addDeckDataDetail *[]DeckDetail) (string, error) {

	var deckCode = randDeckCode(6)

	// owner name outline deckkind を受け取る
	addDeckData.DeckCode = deckCode

	var deckDb, deckDbErr = connectDbWithDeck()
	if deckDbErr != nil {
		return "", deckDbErr
	}
	deckResult := deckDb.Table("deck").Create(&addDeckData)
	if deckResult.Error != nil {
		return "", deckResult.Error
	}

	closeDeckDb, _ := deckDb.DB()
	defer closeDeckDb.Close()

	// detail側
	// card_id, card_num, card_flag を配列で

	for i := 0; i < len(*addDeckDataDetail); i++ {
		(*addDeckDataDetail)[i].DeckCode = deckCode
	}

	var db, err = connectDbWithDeckDetail()
	if err != nil {
		return "", err
	}
	result := db.Table("deck_detail").Create(&addDeckDataDetail)
	if result.Error != nil {
		return "", result.Error
	}

	closedb, _ := db.DB()
	defer closedb.Close()

	return deckCode, err
}

// 更新の場合、新しいデッキを登録
// 古いデッキを削除
func DeleteAndAddDeck(addDeckData *Deck, addDeckDataDetail *[]DeckDetail) (string, error) {
	// 古いデッキコードを一時保存
	var oldDeckCode = addDeckData.DeckCode

	var deckCode, _ = AddDeckAndDetail(addDeckData, addDeckDataDetail)

	// 古いデッキを削除する
	var deckDb, deckDbErr = connectDbWithDeck()
	if deckDbErr != nil {
		return "", deckDbErr
	}
	deckResult := deckDb.Table("deck").Delete(&Deck{}, "deck_code = ?", oldDeckCode)
	if deckResult.Error != nil {
		return "", deckResult.Error
	}

	closeDeckDb, _ := deckDb.DB()
	defer closeDeckDb.Close()

	var tmpDeckDetail DeckDetail
	tmpDeckDetail.DeckCode = oldDeckCode

	var db, err = connectDbWithDeckDetail()
	if err != nil {
		return "", err
	}
	result := db.Table("deck_detail").Delete(&DeckDetail{}, "deck_code = ?", oldDeckCode)
	if result.Error != nil {
		return "", result.Error
	}

	closedb, _ := db.DB()
	defer closedb.Close()

	return deckCode, err
}

// 更新の場合、新しいデッキを登録
// 古いデッキを削除
func DeleteDeck(deleteDeckData *Deck) (string, error) {
	// 古いデッキコードを一時保存
	var oldDeckCode = deleteDeckData.DeckCode

	// 古いデッキを削除する
	var deckDb, deckDbErr = connectDbWithDeck()
	if deckDbErr != nil {
		return "", deckDbErr
	}
	deckResult := deckDb.Table("deck").Delete(&Deck{}, "deck_code = ?", oldDeckCode)
	if deckResult.Error != nil {
		return "", deckResult.Error
	}
	closeDeckDb, _ := deckDb.DB()
	defer closeDeckDb.Close()

	var tmpDeckDetail DeckDetail
	tmpDeckDetail.DeckCode = oldDeckCode

	var db, err = connectDbWithDeckDetail()
	if err != nil {
		return "", err
	}
	result := db.Table("deck_detail").Delete(&DeckDetail{}, "deck_code = ?", oldDeckCode)
	if result.Error != nil {
		return "", result.Error
	}

	closedb, _ := db.DB()
	defer closedb.Close()

	return oldDeckCode, err
}

// デッキコード作成メソッド
func randDeckCode(length int) string {
	rand.Seed(time.Now().UnixNano())

	// 使用する文字のリスト
	characters := "abcdefghijklmnopqrstuvwxyz0123456789"

	// ランダムな文字列を生成
	result := make([]byte, length)
	for i := 0; i < length; i++ {
		result[i] = characters[rand.Intn(len(characters))]
	}

	return string(result)
}
