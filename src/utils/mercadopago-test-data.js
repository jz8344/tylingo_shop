// 🔧 Tarjetas de Prueba para MercadoPago - Argentina (ARS)
// Usar estas tarjetas en el ambiente de testing

const MERCADOPAGO_TEST_CARDS = {
  // VISA - Aprobación automática (Argentina)
  visa_approved: {
    number: "4509 9535 6623 3704",
    cvv: "123",
    expiry: "11/25",
    holder: "APRO"
  },
  
  // VISA - Rechazo por fondos insuficientes (Argentina)
  visa_insufficient_funds: {
    number: "4013 5406 8274 6260",
    cvv: "123", 
    expiry: "11/25",
    holder: "FUND"
  },
  
  // Mastercard - Aprobación automática (Argentina)
  mastercard_approved: {
    number: "5031 7557 3453 0604",
    cvv: "123",
    expiry: "11/25", 
    holder: "APRO"
  },
  
  // VISA - Rechazo por otros motivos (Argentina)
  visa_rejected: {
    number: "4074 7557 5556 5068",
    cvv: "123",
    expiry: "11/25",
    holder: "OTHE"
  },
  
  // American Express - Aprobación automática (Argentina)
  amex_approved: {
    number: "3711 803032 57522",
    cvv: "1234",
    expiry: "11/25",
    holder: "APRO"
  }
}

// 📋 Usuarios de Prueba para MercadoPago
const MERCADOPAGO_TEST_USERS = {
  buyer: {
    email: "test_user_463227716@testuser.com",
    password: "qatest8149"
  },
  seller: {
    email: "test_user_463227845@testuser.com", 
    password: "qatest8149"
  }
}

export { MERCADOPAGO_TEST_CARDS, MERCADOPAGO_TEST_USERS }