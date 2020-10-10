import { MIXIN_PAY_PATH, ENVELOPE_PAYMENT } from "./constants.js";
import { verifyEnvelopePayment } from "../backend";

function triggerPayment({
  envelope_id,
  trace_id,
  recipient_id,
  asset_id,
  amount,
}) {
  let url = new URL(MIXIN_PAY_PATH);
  url.searchParams.append("trace", trace_id);
  url.searchParams.append("recipient", recipient_id);
  url.searchParams.append("asset", asset_id);
  url.searchParams.append("amount", amount);
  url.searchParams.append("memo", "Envelope#" + envelope_id); // NOTE: iOS not decoding the white space correctly, fix it

  // window.location.href = url.href;
  window.open(url.href, "_blank");
}

async function waitForEnvelopePayment(envelopeId, success) {
  const data = await verifyEnvelopePayment(envelopeId);
  if (!data || data.status === ENVELOPE_PAYMENT.PENDING) {
    // try again
    setTimeout(async () => {
      await waitForEnvelopePayment(envelopeId, success);
    }, 1500);
    return;
  }
  if (data.status === ENVELOPE_PAYMENT.SUCCEEDED) {
    success();
    return;
  }
  console.log(`payment status: ${data.status}`);
  return;
}

export { triggerPayment, waitForEnvelopePayment };
