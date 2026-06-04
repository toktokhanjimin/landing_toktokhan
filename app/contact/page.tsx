import type { Metadata } from "next";
import ContactClient from "../components/ContactClient";

export const metadata: Metadata = {
  title: "문의하기",
  description: "AX 도입, 프로젝트 협업 등 궁금한 점을 남겨주세요.",
  openGraph: {
    title: "문의하기 | 똑똑한개발자",
    description: "AX 도입, 프로젝트 협업 등 궁금한 점을 남겨주세요.",
  },
};

export default function ContactPage() {
  return (
    <ContactClient
      formUrl="https://www.pluuug.com/form/w464pT1uRZ"
      title="문의하기"
      description={"AX 도입, 프로젝트 협업 등\n궁금한 점을 남겨주세요."}
      fallbackLabel="문의 폼 열기"
    />
  );
}
