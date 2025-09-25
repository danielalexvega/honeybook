import React from "react";
import DisclaimerBase from "./DisclaimerBase";

type InformationalDisclaimerProps = Readonly<{
  title: string;
  text: string;
  componentId: string;
}>;

const InformationalDisclaimer: React.FC<InformationalDisclaimerProps> = ({ title, text, componentId }) => (
  <DisclaimerBase title={title} text={text} theme="base" componentId={componentId} />
);

export default InformationalDisclaimer;