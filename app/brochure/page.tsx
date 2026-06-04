import type { Metadata } from "next";
import ContactClient from "../components/ContactClient";

export const metadata: Metadata = {
  title: "서비스 소개서",
  description: "똑똑한개발자의 서비스 소개서를 받아보세요.",
  openGraph: {
    title: "서비스 소개서 | 똑똑한개발자",
    description: "똑똑한개발자의 서비스 소개서를 받아보세요.",
  },
};

export default function BrochurePage() {
  return (
    <ContactClient
      formUrl="https://www.pluuug.com/form/pbrPZzeYyu"
      title="서비스 소개서"
      description={"똑똑한개발자의 서비스 소개서를\n받아보세요."}
      fallbackLabel="소개서 신청하기"
    />
  );
}
