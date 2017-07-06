import mongoose from '../db';
import { Document, Schema } from 'mongoose';

//988c468f153641aea65dde82660085cd
export const CurrencySchema = new Schema(
  {
    base: { type: String },
    rates: {
      AED: { type: Number },
      AFN: { type: Number },
      ALL: { type: Number },
      AMD: { type: Number },
      ANG: { type: Number },
      AOA: { type: Number },
      ARS: { type: Number },
      AUD: { type: Number },
      AWG: { type: Number },
      AZN: { type: Number },
      BAM: { type: Number },
      BBD: { type: Number },
      BDT: { type: Number },
      BGN: { type: Number },
      BHD: { type: Number },
      BIF: { type: Number },
      BMD: { type: Number },
      BND: { type: Number },
      BOB: { type: Number },
      BRL: { type: Number },
      BSD: { type: Number },
      BTC: { type: Number },
      BTN: { type: Number },
      BWP: { type: Number },
      BYN: { type: Number },
      BZD: { type: Number },
      CAD: { type: Number },
      CDF: { type: Number },
      CHF: { type: Number },
      CLF: { type: Number },
      CLP: { type: Number },
      CNH: { type: Number },
      CNY: { type: Number },
      COP: { type: Number },
      CRC: { type: Number },
      CUC: { type: Number },
      CUP: { type: Number },
      CVE: { type: Number },
      CZK: { type: Number },
      DJF: { type: Number },
      DKK: { type: Number },
      DOP: { type: Number },
      DZD: { type: Number },
      EGP: { type: Number },
      ERN: { type: Number },
      ETB: { type: Number },
      EUR: { type: Number },
      FJD: { type: Number },
      FKP: { type: Number },
      GBP: { type: Number },
      GEL: { type: Number },
      GGP: { type: Number },
      GHS: { type: Number },
      GIP: { type: Number },
      GMD: { type: Number },
      GNF: { type: Number },
      GTQ: { type: Number },
      GYD: { type: Number },
      HKD: { type: Number },
      HNL: { type: Number },
      HRK: { type: Number },
      HTG: { type: Number },
      HUF: { type: Number },
      IDR: { type: Number },
      ILS: { type: Number },
      IMP: { type: Number },
      INR: { type: Number },
      IQD: { type: Number },
      IRR: { type: Number },
      ISK: { type: Number },
      JEP: { type: Number },
      JMD: { type: Number },
      JOD: { type: Number },
      JPY: { type: Number },
      KES: { type: Number },
      KGS: { type: Number },
      KHR: { type: Number },
      KMF: { type: Number },
      KPW: { type: Number },
      KRW: { type: Number },
      KWD: { type: Number },
      KYD: { type: Number },
      KZT: { type: Number },
      LAK: { type: Number },
      LBP: { type: Number },
      LKR: { type: Number },
      LRD: { type: Number },
      LSL: { type: Number },
      LYD: { type: Number },
      MAD: { type: Number },
      MDL: { type: Number },
      MGA: { type: Number },
      MKD: { type: Number },
      MMK: { type: Number },
      MNT: { type: Number },
      MOP: { type: Number },
      MRO: { type: Number },
      MUR: { type: Number },
      MVR: { type: Number },
      MWK: { type: Number },
      MXN: { type: Number },
      MYR: { type: Number },
      MZN: { type: Number },
      NAD: { type: Number },
      NGN: { type: Number },
      NIO: { type: Number },
      NOK: { type: Number },
      NPR: { type: Number },
      NZD: { type: Number },
      OMR: { type: Number },
      PAB: { type: Number },
      PEN: { type: Number },
      PGK: { type: Number },
      PHP: { type: Number },
      PKR: { type: Number },
      PLN: { type: Number },
      PYG: { type: Number },
      QAR: { type: Number },
      RON: { type: Number },
      RSD: { type: Number },
      RUB: { type: Number },
      RWF: { type: Number },
      SAR: { type: Number },
      SBD: { type: Number },
      SCR: { type: Number },
      SDG: { type: Number },
      SEK: { type: Number },
      SGD: { type: Number },
      SHP: { type: Number },
      SLL: { type: Number },
      SOS: { type: Number },
      SRD: { type: Number },
      SSP: { type: Number },
      STD: { type: Number },
      SVC: { type: Number },
      SYP: { type: Number },
      SZL: { type: Number },
      THB: { type: Number },
      TJS: { type: Number },
      TMT: { type: Number },
      TND: { type: Number },
      TOP: { type: Number },
      TRY: { type: Number },
      TTD: { type: Number },
      TWD: { type: Number },
      TZS: { type: Number },
      UAH: { type: Number },
      UGX: { type: Number },
      USD: { type: Number },
      UYU: { type: Number },
      UZS: { type: Number },
      VEF: { type: Number },
      VND: { type: Number },
      VUV: { type: Number },
      WST: { type: Number },
      XAF: { type: Number },
      XAG: { type: Number },
      XAU: { type: Number },
      XCD: { type: Number },
      XDR: { type: Number },
      XOF: { type: Number },
      XPD: { type: Number },
      XPF: { type: Number },
      XPT: { type: Number },
      YER: { type: Number },
      ZAR: { type: Number },
      ZMW: { type: Number },
      ZWL: { type: Number }
    },
    source: { type: String, default: null, required: true }
  },
  { timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' }, strict: false }
);

export default mongoose.model('Currency', CurrencySchema);
