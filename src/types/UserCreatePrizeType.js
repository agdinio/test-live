class UserCreatePrizeType {
  constructor(
    userId,
    prizeBoardId,
    prizeBoardPrizeId,
    agreed,
    claimed,
    starUsed,
    currencyType,
    isDebitQuantity,
    currencyAmount,
    starForRedeem,
    id
  ) {
    ;(this.userId = userId),
      (this.prizeBoardId = prizeBoardId),
      (this.prizeBoardPrizeId = prizeBoardPrizeId),
      (this.agreed = agreed || false),
      (this.claimed = claimed || false),
      (this.starUsed = starUsed || 0),
      (this.currencyType = currencyType || ''),
      (this.isDebitQuantity = isDebitQuantity || false)
    this.currencyAmount = currencyAmount || 0
    this.starForRedeem = starForRedeem || false
    this.id = id || 0
  }

  toObject() {
    return {
      userId: this.userId,
      prizeBoardId: this.prizeBoardId,
      prizeBoardPrizeId: this.prizeBoardPrizeId,
      agreed: this.agreed,
      claimed: this.claimed,
      starUsed: this.starUsed,
      currencyType: this.currencyType,
      isDebitQuantity: this.isDebitQuantity,
      currencyAmount: this.currencyAmount,
      starForRedeem: this.starForRedeem,
      id: this.id,
    }
  }
}

module.exports = UserCreatePrizeType
