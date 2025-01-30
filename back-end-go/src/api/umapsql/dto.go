package umapsql

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
)

type ApiResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

func (resp ApiResponse) ToJson() gin.H {
	result := gin.H{
		"success": resp.Success,
		"message": resp.Message,
		"data":    resp.Data,
	}
	return result
}

type ChessApiResponse struct {
	Status string      `json:"status"`
}

func (resp ChessApiResponse) ToJson() gin.H {
	result := gin.H{
		"status": resp.Status,
	}
	return result
}

// next-auth の仕様にも合わせている
type User struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Timestamp time.Time `json:"timestamp"`
	Image     string    `json:"image"`
}

func (user User) ToJson() gin.H {
	result := gin.H{
		"id":        user.ID,
		"name":      user.Name,
		"email":     user.Email,
		"timestamp": user.Timestamp,
		"image":     user.Image,
	}
	return result
}

type Deck struct {
	ID        int       `gorm:"primaryKey;AUTO_INCREMENT" json:"id"`
	DeckCode  string    `gorm:"unique" json:"deck_code"`
	Owner     string    `gorm:"index" json:"owner"`
	Name      string    `json:"name"`
	DeckKind  int       `json:"deck_kind"`
	Outline   string    `json:"outline"`
	CreatedAt time.Time `json:"create_at"`
	UpdateAt  time.Time `json:"update_at"`
}

// まだ
type DeckDetail struct {
	ID       uint   `gorm:"primaryKey;AUTO_INCREMENT" json:"id"`
	DeckCode string `gorm:"index" json:"deck_code"` // インデックス対象
	CardId   string `json:"card_id"`
	CardNum  uint   `json:"card_num"` // 1以上3以下
	CardFlag uint   `json:"card_flag"`
}

type DeckView struct {
	Deck        Deck         `json:"deck"`
	DeckDetails []DeckDetail `json:"deck_details"`
	EditType    string       `json:"edit_type"`
}

type Card struct {
	ID                 uint           `gorm:"primaryKey" json:"id"`
	CardId             string         `gorm:"unique;index" json:"card_id"`
	PackId             uint           `json:"pack_id"`
	Name               string         `json:"name"`
	ClassId            uint           `json:"class_id"`
	TitleId            uint           `json:"title_id"`
	KindIdList         pq.Int64Array  `gorm:"type:integer[]" json:"kind_id_list"`
	TypeIdList         pq.Int64Array  `gorm:"type:integer[]" json:"type_id_list"`
	EffectIdList       pq.Int64Array  `gorm:"type:integer[]" json:"effect_id_list"`
	Cost               uint           `json:"cost"`
	Text               string         `json:"text"`
	Atk                uint           `json:"atk"`
	Hp                 uint           `json:"hp"`
	RarityId           uint           `json:"rarity_id"`
	CollaboName        string         `json:"collabo_name"`
	RelationCardIdList pq.StringArray `gorm:"type:text[]" json:"relation_card_id_list"`
	CardLimit          uint           `json:"card_limit"`
}

type Pack struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	PackId      string    `json:"pack_id"`
	Name        string    `json:"name"`
	ReleaseDate time.Time `json:"release_date"`
}

type CardClass struct {
	ID   uint   `gorm:"primaryKey" json:"id"`
	Name string `json:"name"`
}

type CardTitle struct {
	ID   uint   `gorm:"primaryKey" json:"id"`
	Name string `json:"name"`
}

type CardKind struct {
	ID   uint   `gorm:"primaryKey" json:"id"`
	Name string `json:"name"`
}

type CardType struct {
	ID   uint   `gorm:"primaryKey" json:"id"`
	Name string `json:"name"`
}

type CardEffect struct {
	ID   uint   `gorm:"primaryKey AUTO_INCREMENT" json:"id"`
	Name string `json:"name"`
}

type CardRarity struct {
	ID   uint   `gorm:"primaryKey AUTO_INCREMENT" json:"id"`
	Name string `json:"name"`
}
