# vies-web — website vies.com.vn

VIES — nhà phân phối vòng bi và linh kiện công nghiệp (SKF, FAG, NTN, TIMKEN).
Next.js + PayloadCMS.

## Jira

Việc của website `vies.com.vn` quản lý trên Jira project **MKT "Digital Marketing"**
(board 215, Scrum, sprint một tuần) tại `tetravn.atlassian.net` — board chung của
các web marketing (tetra.vn, carptech.vn, sancire.com, tantran.dev, kvz.ge,
vies.com.vn). Toạ độ và credential để sẵn trong `.env`: `JIRA_URL`,
`JIRA_USERNAME`, `JIRA_API_TOKEN`, `JIRA_PROJECT_KEY=MKT`, `JIRA_BOARD_ID=215`,
`JIRA_COMPONENT_ID=10042`.

- Gọi REST API trực tiếp: `curl -u "$JIRA_USERNAME:$JIRA_API_TOKEN" "$JIRA_URL/rest/api/3/..."`
  (quote inline, token dài có ký tự đặc biệt). Tìm kiếm dùng `GET /rest/api/3/search/jql`.
- Mọi ticket **phải gắn component `vies.com.vn`** (`"components":[{"id":"10042"}]`),
  không thì lẫn với site khác. Story point `customfield_10035`; transition To Do
  11, In Progress 21, Done 31; issue type Task 10006, Story 10004, Epic 10000.
- Token trong `.env` là token cá nhân có quyền trên mọi project — đừng bơm vào
  env container, đừng đặt tiền tố `NEXT_PUBLIC_`.
