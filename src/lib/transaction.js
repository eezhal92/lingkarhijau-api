// ADD_BALANCE
// REDEEM_BALANCE
// TRANSFER
//


// balance

// DEPOSIT / TOPUP
// QUICK_CASH
// REDEEM
// TRANSFER

const histories = [
  {
    "id": "1",
    "type": "DEPOSIT",
    "value": 60000,
    "account": "account-1",
    "meta": {
      "pickup": true,
      "depositor": "account-1",
      "items": [
        {
          "text": "",
          "type": "",
          "unit": "",
          "price": 0,
          "qty": 0
        }
      ]
    }
  },
  {
    "id": "2",
    "type": "DEPOSIT",
    "value": 55000,
    "account": "account-1",
    "meta": {
      "pickup": true,
      "depositor": "account-1",
      "items": [
        {
          "text": "",
          "type": "",
          "unit": "",
          "price": 0,
          "qty": 0
        }
      ]
    }
  },
  {
    "id": "a-b-c",
    "type": "DONATION",
    "account": "account-1",
    "value": 0,
    "meta": {
      "donation": true,
      "donator": "account-1",
    },
  },
  {
    "id": "u92ks83",
    "type": "REDEEM",
    "account": "account-1",
    "value": 100000,
    "meta": {
      "transfer": true,
      "bankAccount": {
        "account": "082342347101",
        "vendor": "bca"
      },
      "donator": "account-1",
    },
  },
  {
    "id": "u92ks83",
    "type": "QUICK_CASH",
    "account": "account-1",
    "value": 100000,
    "meta": {
      "quick_cash": true,
      "donator": "account-1",
    },
  },
]
