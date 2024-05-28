package testdb

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
)

type Tabler interface {
    TableName() string
}

// postgres 上では test_user として認識されるようにする
type TestUser struct {
	ID   uint	`gorm:"primaryKey"`
	Name string
}



func Dbtest() string {
	var resultStr string = "te"

	dsn := "host=uma-postgres user=root password=secret dbname=umadb port=5432 sslmode=disable TimeZone=Asia/Tokyo"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}
	// このメソッドを実行すると構造体名がそのままテーブルとして利用される。しかしすべてに影響
	// db.SingularTable(true)

	// マイグレーション
	err = db.Table("test_user").AutoMigrate(&TestUser{})
	if err != nil {
		log.Fatal(err)
	}

	// データの作成
	user := TestUser{Name: "John Doe"}
	result := db.Table("test_user").Create(&user)
	if result.Error != nil {
		log.Fatal(result.Error)
	}

	// データの取得
	var users []TestUser
	db.Table("test_user").Find(&users)
	for _, u := range users {
		log.Println(u.Name)
		resultStr = u.Name
	}

	// データベース接続のクローズ
	dbe, err := db.DB()
    defer dbe.Close()

	return resultStr
}