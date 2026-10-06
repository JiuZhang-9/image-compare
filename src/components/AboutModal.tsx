import { useEffect, useRef, useState } from "react";
import { Copy, ExternalLink, Heart, Info, MessageCircle, X } from "lucide-react";
import { useI18n } from "../useI18n";
import wechatPayImage from "../assets/support/wechat-pay-scan.jpg";
import alipayImage from "../assets/support/alipay-scan.jpg";

type Props = { onClose: () => void };

const APP_VERSION = "1.2.0";
const QQ_GROUP = "748934113";

export default function AboutModal({ onClose }: Props) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<"software" | "feedback" | "support">("software");
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [onClose]);

  async function copyQqGroup() {
    await navigator.clipboard?.writeText(QQ_GROUP);
  }

  return (
    <div className="about-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="about-dialog" role="dialog" aria-modal="true" aria-labelledby="about-title" tabIndex={-1} ref={dialogRef}>
        <div className="about-dialog-header">
          <div className="about-heading">
            <Info size={20} aria-hidden="true" />
            <div>
              <h2 id="about-title">{t("aboutTitle")}</h2>
              <p>{t("aboutSubtitle")}</p>
            </div>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label={t("closeAbout")} title={t("closeAbout")}><X size={18} /></button>
        </div>

        <div className="about-tabs" role="tablist" aria-label={t("aboutSections")}>
          <button type="button" role="tab" aria-selected={activeTab === "software"} className={activeTab === "software" ? "active" : ""} onClick={() => setActiveTab("software")}><Info size={16} />{t("aboutSoftware")}</button>
          <button type="button" role="tab" aria-selected={activeTab === "feedback"} className={activeTab === "feedback" ? "active" : ""} onClick={() => setActiveTab("feedback")}><MessageCircle size={16} />{t("aboutFeedback")}</button>
          <button type="button" role="tab" aria-selected={activeTab === "support"} className={activeTab === "support" ? "active" : ""} onClick={() => setActiveTab("support")}><Heart size={16} />{t("aboutSupport")}</button>
        </div>

        <div className="about-content">
          {activeTab === "software" && <section role="tabpanel" className="about-panel">
            <div className="about-version"><strong>{t("appTitle")}</strong><span>v{APP_VERSION}</span></div>
            <p>{t("aboutDescription")}</p>
            <h3>{t("aboutFeatures")}</h3>
            <ul><li>{t("aboutFeatureSingle")}</li><li>{t("aboutFeatureCompare")}</li><li>{t("aboutFeatureLocal")}</li></ul>
            <h3>{t("aboutRoadmap")}</h3>
            <p>{t("aboutRoadmapText")}</p>
            <div className="about-links"><a href="https://github.com/lzy4107932-commits/image-compare" target="_blank" rel="noreferrer">GitHub <ExternalLink size={14} /></a><span>{t("aboutLicense")}: MIT</span></div>
          </section>}

          {activeTab === "feedback" && <section role="tabpanel" className="about-panel">
            <p>{t("aboutFeedbackIntro")}</p>
            <div className="contact-row"><div><strong>{t("qqGroup")}</strong><span>{t("qqGroupName")} · {QQ_GROUP}</span></div><button type="button" className="secondary-button" onClick={copyQqGroup}><Copy size={15} />{t("copy")}</button></div>
            <div className="contact-row"><div><strong>{t("wechatGroup")}</strong><span>{t("contactToBeConfigured")}</span></div><div className="qr-placeholder" aria-label={t("qrToBeConfigured")}>{t("qrToBeConfigured")}</div></div>
            <div className="feedback-note">{t("aboutFeedbackNote")}</div>
          </section>}

          {activeTab === "support" && <section role="tabpanel" className="about-panel">
            <p>{t("aboutSupportIntro")}</p>
            <div className="support-qr-grid"><div><img className="support-qr-image" src={wechatPayImage} alt={t("wechatPay")} /><span>{t("wechatPay")}</span></div><div><img className="support-qr-image" src={alipayImage} alt={t("alipay")} /><span>{t("alipay")}</span></div></div>
            <p className="support-note">{t("aboutSupportNote")}</p>
          </section>}
        </div>
      </div>
    </div>
  );
}
