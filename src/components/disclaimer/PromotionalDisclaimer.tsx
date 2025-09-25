import React from "react";
import DisclaimerBase from "./DisclaimerBase";

type PromotionalDisclaimerProps = Readonly<{
  title: string;
  text: string;
  componentId: string;
}>;

const PromotionalDisclaimer: React.FC<PromotionalDisclaimerProps> = ({ title, text, componentId }) => (
  <DisclaimerBase title={title} text={text} componentId={componentId} theme="burgundy" />
);

export default PromotionalDisclaimer;
