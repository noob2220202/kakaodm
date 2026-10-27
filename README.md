# 카톡 조작기

실제 카카오톡과 비슷하게 생긴 가짜 대화를 만들고 저장/불러오는 장난용 도구입니다.

- 로그인 없이 넷플릭스 프로필처럼 "내 프로필"을 선택해서 시작합니다.
- 프로필 안에서 여러 개의 대화방(상대방 이름/프로필 사진)을 만들 수 있습니다.
- 대화방에서 텍스트/사진 메시지를 내 메시지 또는 상대 메시지로 자유롭게 추가·수정·삭제할 수 있습니다.
- **캡처 모드**: 채팅방에서 카메라 아이콘을 누르면 편집용 버튼이 전부 사라지고 실제 카톡 스크린샷처럼 보이는 화면만 남습니다. 화면을 탭하면 잠깐 "PNG로 저장 / 캡처 모드 종료" 버튼이 나타났다가 자동으로 사라집니다.

## 기술 스택

- Next.js (App Router) + TypeScript + Tailwind CSS
- Prisma + SQLite (이미지도 base64로 DB에 함께 저장)

## 시작하기

```bash
npm install
npx prisma migrate dev   # 최초 1회, DB 생성
npm run dev
```

`.env`의 `DATABASE_URL`은 SQLite 파일 경로입니다 (기본값: `prisma/dev.db`).

## 빌드

```bash
npm run build
npm start
```
