const Facturapi = require("facturapi");
// node_modules/facturapi/src/enums.js

const facturapi = new Facturapi(process.env.FACTURAPI_KEY);

interface ProductType {
  description: string;
  productKey: string;
  price: number;
}

interface Item {
  product: ProductType;
}

enum FacturapiPaymentFormEnum {
  EFECTIVO = "01",
  CHEQUE_NOMINATIVO = "02",
  TRANSFERENCIA_ELECTRONICA_DE_FONDOS = "03",
  TARJETA_DE_CREDITO = "04",
  MONEDERO_ELECTRONICO = "05",
  DINERO_ELECTRONICO = "06",
  VALES_DE_DESPENSA = "08",
  DACION_EN_PAGO = "12",
  PAGO_POR_SUBROGACION = "13",
  PAGO_POR_CONSIGNACION = "14",
  CONDONACION = "15",
  COMPENSACION = "17",
  NOVACION = "23",
  CONFUSION = "24",
  REMISIÓN_DE_DEUDA = "25",
  PRESCRIPCION_O_CADUCIDAD = "26",
  A_SATISFACCION_DEL_ACREEDOR = "27",
  TARJETA_DE_DEBITO = "28",
  TARJETA_DE_SERVICIOS = "29",
  APLICACION_DE_ANTICIPOS = "30",
  INTERMEDIARIO_DE_PAGOS = "31",
  POR_DEFINIR = "99",
}

interface CreateInvoiceProps {
  legalName: string;
  email: string;
  taxId: string;
  taxSystem: string;
  zip: string;
  items: Item[];
  use: string;
  paymentForm: FacturapiPaymentFormEnum | string;
}

export const createInvoiceDB = async ({
  legalName,
  email,
  taxId,
  taxSystem,
  zip,
  items,
  use,
  paymentForm,
}: CreateInvoiceProps) => {
  return await facturapi.invoices.create({
    customer: {
      legal_name: legalName,
      email: email,
      tax_id: taxId,
      tax_system: taxSystem,
      address: {
        zip: zip,
      },
    },
    items: items,
    use: use,
    payment_form: paymentForm,
  });
};
