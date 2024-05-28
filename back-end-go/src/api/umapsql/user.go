package umapsql

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func connectDbWithUser() (*gorm.DB, error) {
	dsn := "host=uma-postgres user=root password=secret dbname=umadb port=5432 sslmode=disable TimeZone=Asia/Tokyo"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	// このメソッドを実行すると構造体名がそのままテーブルとして利用される。しかしすべてに影響
	// db.SingularTable(true)

	// マイグレーション
	err = db.Table("user").AutoMigrate(&User{})

	closedb, _ := db.DB()
	defer closedb.Close()

	return db, err
}

// ユーザの作成
func AddUser(addUserData *User) (bool, error) {
	var db, err = connectDbWithUser()
	if err != nil {
		return false, err
	}

	result := db.Table("user").Create(&addUserData)
	if result.Error != nil {
		return false, result.Error
	}

	closedb, _ := db.DB()
	defer closedb.Close()

	return true, err
}

// ユーザの取得
func GetUser(searchUser *User) (*User, error) {
	var db, err = connectDbWithUser()
	if err != nil {
		return nil, err
	}

	log.Println(&searchUser)

	// データの取得
	var user User
	db.Table("user").Where(&searchUser).First(&user)
	log.Println(user)

	closedb, _ := db.DB()
	defer closedb.Close()

	return &user, err
}
