package umapsql

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func connectDbWithCard() (*gorm.DB, error) {
	dsn := "host=uma-postgres user=root password=secret dbname=umadb port=5432 sslmode=disable TimeZone=Asia/Tokyo"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	// このメソッドを実行すると構造体名がそのままテーブルとして利用される。しかしすべてに影響
	// db.SingularTable(true)

	// マイグレーション
	err = db.Table("card").AutoMigrate(&Card{})

	return db, err
}

// 作成
func AddCard(addData *Card) (bool, error) {
	var db, err = connectDbWithCard()
	if err != nil {
		return false, err
	}

	result := db.Table("card").Create(&addData)
	if result.Error != nil {
		return false, result.Error
	}

	closedb, err := db.DB()
	defer closedb.Close()

	return true, err
}

// 更新
func UpdateCard(updateData *Card) (bool, error) {
	var db, err = connectDbWithCard()
	if err != nil {
		return false, err
	}

	result := db.Table("card").Save(&updateData)
	if result.Error != nil {
		return false, result.Error
	}

	closedb, err := db.DB()
	defer closedb.Close()

	return true, err
}

// 取得
func GetCard(searchData *Card) (*Card, error) {
	var db, err = connectDbWithCard()
	if err != nil {
		return nil, err
	}

	// データの取得
	var card Card
	db.Table("card").Where(&searchData).First(&card)

	closedb, err := db.DB()
	defer closedb.Close()

	return &card, err
}

// 取得
func GetCardList(searchData *Card) ([]Card, error) {
	var db, err = connectDbWithCard()
	if err != nil {
		return nil, err
	}

	// log.Println(&searchData)

	// データの取得
	cards := []Card{}

	if searchData.ClassId < 100 {
		// クラスで検索
		// card_kind は 5, 6, 7以外
		subQuery := db.Select("MIN(id)").Group("collabo_name").Table("card").Where(searchData).Or("class_id = '7'")
		db.Table("card").Where("id IN (?)", subQuery).Order("id").Find(&cards)

		// db.Table("card").Order("id ASC").Where(searchData).Or("class_id = '7'").Find(&cards)
	} else {
		// タイトルで検索
		titleId := searchData.ClassId
		subQuery := db.Select("MIN(id)").Group("collabo_name").Table("card").Where("title_id = ?", titleId)
		db.Table("card").Where("id IN (?)", subQuery).Order("id").Find(&cards)
	}

	closedb, err := db.DB()
	defer closedb.Close()

	return cards, err
}
