# Form Editor

Tài liệu này ghi lại các tính năng hiện có của phần tạo form trong CMS.

## Files liên quan

- Editor UI: `src/components/cms/FormBuilderEditor.tsx`
- Form admin page defaults: `src/app/admin/forms/[id]/page.tsx`

## Form Builder

Form editor hỗ trợ hai chế độ:

- `onestep`: form một bước.
- `multistep`: form nhiều bước, có thể thêm/xóa step và hiển thị progress trong preview/runtime.

Mỗi step có:

- `title`: tiêu đề step.
- `description`: mô tả ngắn của step.
- `fields`: danh sách form fields trong step.

Preview/runtime phải hiển thị `title` và `description` của step hiện tại. Với multi-step, phần progress nằm phía trên, còn title/description nằm dưới progress để người dùng thấy ngữ cảnh của step đang điền.

## Form Fields

Mỗi field có các thuộc tính chính:

- `id`: internal UUID của field.
- `fieldId`: key ASCII ổn định dùng cho data syncing và submit payload.
- `type`: kiểu dữ liệu field.
- `label`: nhãn hiển thị cho người dùng.
- `placeholder`: placeholder của input.
- `defaultValue`: giá trị mặc định.
- `hidden`: field ẩn, không render trên UI nhưng vẫn có thể gửi data nếu có default value.
- `required`: field bắt buộc.
- `width`: `full` hoặc `half`.
- `options`: danh sách option cho `select`, `radio`, `checkbox`.

Các field type hiện có:

- `text`
- `email`
- `phone`
- `textarea`
- `select`
- `radio`
- `checkbox`
- `rating`
- `slider`
- `date`
- `file`

## Field ID

`fieldId` là key dữ liệu chính của form field. Field này dùng chữ cái/số ASCII, tự động normalize từ label hoặc type khi tạo field mới.

Quy tắc:

- Chuyển chữ có dấu về ASCII.
- Chuyển về lowercase.
- Ký tự không phải `a-z` hoặc `0-9` được đổi thành `_`.
- Key luôn bắt đầu bằng chữ cái; nếu không, prefix `field_` sẽ được thêm.
- Khi tạo field mới, editor tự tạo `fieldId` không trùng trong toàn bộ form.

Runtime dùng `fieldId` làm key chính cho:

- `formData`
- validation errors
- submit payload
- URL query default value lookup

Fallback nếu field cũ chưa có `fieldId`:

1. normalized label
2. internal `id`

## Default Value

Field hỗ trợ `defaultValue` để prefill dữ liệu khi form render.

Có hai dạng:

- Static value: ví dụ `Automation`.
- URL query value: ví dụ `?service`.

Ví dụ URL:

```txt
https://example.com/contact?service=automation
```

Nếu field `service` có `defaultValue` là `?service`, runtime sẽ tự prefill giá trị `automation`.

Nếu `defaultValue` không bắt đầu bằng `?`, runtime vẫn cố match URL query theo thứ tự:

1. param được khai báo trong `defaultValue` nếu có dạng `?param`
2. `fieldId`
3. internal `id`
4. raw `label`
5. normalized `label`

Sau đó fallback về static default value.

## Hidden Fields

Field có thể bật `hidden`.

Behavior:

- Hidden field không hiển thị trong preview/runtime UI.
- Hidden field không bị validate required.
- Hidden field vẫn được đưa vào `formData` nếu có default value hoặc URL query value.

Use case chính:

- Tracking campaign/source.
- Prefill service/package từ URL.
- Gửi metadata sang CRM hoặc automation platform mà không hiển thị cho user.


## Design Settings

Design options được gom vào mục `Advanced Design Settings` để giảm khoảng trắng và giữ UI form config gọn hơn.

Các nhóm design chính:

- Submit button design.
- Form field design.

Submit button hỗ trợ:

- Style: `solid`, `outline`, `soft`.
- Background color.
- Text color.
- Size: `sm`, `md`, `lg`.
- Width: `auto`, `full`.
- Alignment: `left`, `center`, `right`.
- Radius riêng cho submit button.

Form field hỗ trợ:

- Background color.
- Border color.
- Focus color.
- Text color.
- Label color.
- Size: `sm`, `md`, `lg`.
- Radius riêng cho field.
- Spacing: `compact`, `comfortable`, `spacious`.
- Label style: uppercase hoặc normal.
- Border width: thin hoặc medium.

Runtime preview áp dụng các setting này trực tiếp vào input, textarea, select và submit button.

## Compact Editor UI

Form builder UI đã được làm gọn lại để giảm khoảng trắng:

- Nút xóa field nằm ở góc phải phía trên card.
- `defaultValue` nằm cùng cụm với data type, width và checkbox để giảm chiều cao card.
- Các checkbox `required` và `hidden` nằm gần default value.

## Submit Payload Contract

Payload submit dùng key theo `fieldId` khi có.

Ví dụ:

```json
{
  "full_name": "Nguyen Van A",
  "email": "hello@example.com",
  "service": "automation"
}
```

Không nên dựa vào `label` làm key đồng bộ dữ liệu vì label có thể dùng tiếng Việt, có dấu hoặc thay đổi theo nội dung UI.
