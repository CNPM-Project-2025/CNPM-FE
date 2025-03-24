# React + TypeScript + Vite

# Cách dùng 
```
npm run dev
```

# Thông tin 
# CNPM-BE

Dự án này là một ứng dụng React sử dụng TypeScript, được tổ chức theo nguyên tắc **modularity** (mô-đun hóa) và **separation of concerns** (phân tách trách nhiệm). Cấu trúc này giúp dự án dễ bảo trì, mở rộng và làm việc nhóm hiệu quả. Dưới đây là chi tiết về từng thư mục và file, cùng với ý nghĩa của chúng.

## Thư mục gốc

### `public/`
- **Mô tả**: Chứa các tài nguyên tĩnh (static assets) như favicon, logo, file HTML chính (`index.html`), hoặc các file không cần build (như `manifest.json`).
- **Ví dụ**: `public/index.html` là file HTML chính mà Vite (hoặc Webpack) sẽ dùng để render ứng dụng React.
- **Ý nghĩa**: Tách biệt tài nguyên tĩnh khỏi mã nguồn, giúp dễ quản lý.

### `src/`
- **Mô tả**: Thư mục chính chứa toàn bộ mã nguồn của ứng dụng. Đây là nơi bạn viết logic, components, styles, và các file liên quan.

## Thư mục con trong `src/`

### `assets/`
- **Mô tả**: Chứa các tài nguyên động (dynamic assets) được import vào mã nguồn.
- **Thư mục con**:
  - `fonts/`: Chứa các file font (như `.woff`, `.ttf`).
  - `images/`: Chứa hình ảnh (như `.png`, `.jpg`, `.svg`).
  - `layout/`: Chứa các tài nguyên liên quan đến layout (như background images).
  - `pages/`: Tài nguyên dành riêng cho từng page (ví dụ: ảnh hero cho trang Home).
  - `styles/`: Chứa các file CSS/SCSS global hoặc styles chung.
- **Ý nghĩa**: Tổ chức tài nguyên theo loại, dễ tìm kiếm và tái sử dụng.

### `components/`
- **Mô tả**: Chứa các React components, được chia nhỏ để tái sử dụng.
- **Thư mục con**:
  - `common/`: Các components dùng chung (ví dụ: `Button`, `Input`, `Modal`).
  - `layout/`: Components liên quan đến bố cục (ví dụ: `Header`, `Footer`, `Sidebar`).
  - `pages/`: Components đặc thù cho từng trang (ví dụ: `HomePage`, `ProductPage`).
  - `ui/`: Các UI components nhỏ (như `Card`, `Badge`, `Tooltip`).
- **Ý nghĩa**: Phân loại components theo chức năng, giúp dễ bảo trì và tái sử dụng.

### `config/`
- **Mô tả**: Chứa các file cấu hình (configuration) cho ứng dụng.
- **Ví dụ**: Cấu hình API base URL, theme settings, hoặc các biến môi trường.
- **Ý nghĩa**: Tập trung các cấu hình vào một nơi, dễ chỉnh sửa.

### `constants/`
- **Mô tả**: Chứa các hằng số (constants) dùng trong ứng dụng.
- **Ví dụ**: Danh sách category (`CATEGORIES = ["Food", "Drink"]`), mã lỗi, hoặc các giá trị cố định.
- **Ý nghĩa**: Tránh hardcode giá trị trong code, dễ thay đổi và bảo trì.

### `context/`
- **Mô tả**: Chứa các React Context để quản lý state toàn cục.
- **Ví dụ**: `AuthContext` để quản lý trạng thái đăng nhập, hoặc `ThemeContext` để quản lý theme.
- **Ý nghĩa**: Giúp chia sẻ state giữa các components mà không cần truyền props nhiều tầng.

### `hooks/`
- **Mô tả**: Chứa các custom hooks của React.
- **Ví dụ**: `useAuth`, `useFetchData`, `useTheme`.
- **Ý nghĩa**: Tái sử dụng logic giữa các components, giữ code DRY (Don't Repeat Yourself).

### `lib/`
- **Mô tả**: Chứa các thư viện hoặc hàm tiện ích (utilities) không liên quan trực tiếp đến React.
- **Ví dụ**: Hàm format tiền tệ, xử lý ngày giờ, hoặc tích hợp thư viện bên thứ 3 (như Axios).
- **Ý nghĩa**: Tách biệt logic không liên quan đến React, dễ test và tái sử dụng.

### `routes/`
- **Mô tả**: Chứa cấu hình định tuyến (routing) của ứng dụng.
- **Ví dụ**: File `routes.ts` định nghĩa các route (Home, About, Product) và component tương ứng.
- **Ý nghĩa**: Quản lý định tuyến tập trung, dễ mở rộng.

### `services/`
- **Mô tả**: Chứa các hàm gọi API hoặc tương tác với backend.
- **Ví dụ**: `api/productService.ts` chứa các hàm như `getProducts`, `createProduct`.
- **Ý nghĩa**: Tách biệt logic gọi API, dễ mock khi test.

### `slices/`
- **Mô tả**: Thường được dùng khi bạn sử dụng Redux Toolkit. Mỗi slice là một "lát cắt" của state.
- **Ví dụ**: `productSlice`, `authSlice`.
- **Ý nghĩa**: Quản lý state theo từng module, dễ mở rộng.

### `store/`
- **Mô tả**: Chứa cấu hình Redux store.
- **Ví dụ**: `store.ts` để setup Redux store và kết hợp các slice.
- **Ý nghĩa**: Tập trung quản lý state toàn cục.

### `types/`
- **Mô tả**: Chứa các TypeScript type definitions.
- **Ví dụ**: `Product` interface, `User` type.
- **Ý nghĩa**: Quản lý type tập trung, tránh lặp lại và dễ bảo trì.

### `utils/`
- **Mô tả**: Chứa các hàm tiện ích (utilities) dùng trong ứng dụng.
- **Ví dụ**: Hàm format ngày, xử lý chuỗi, hoặc tính toán.
- **Ý nghĩa**: Tái sử dụng các hàm nhỏ, giữ code sạch.

### `App.tsx`
- **Mô tả**: Component chính của ứng dụng, thường chứa logic định tuyến chính (dùng React Router).
- **Ý nghĩa**: Điểm khởi đầu của ứng dụng.

### `index.tsx`
- **Mô tả**: File khởi động ứng dụng, render `App.tsx` vào DOM.
- **Ý nghĩa**: Điểm vào (entry point) của ứng dụng.

### `vite-env.d.ts`
- **Mô tả**: File khai báo môi trường cho Vite (bộ build tool).
- **Ý nghĩa**: Đảm bảo TypeScript hiểu các biến môi trường của Vite (như `import.meta.env`).

## File cấu hình ở thư mục gốc

### `package.json`
- **Mô tả**: Chứa thông tin dự án, dependencies, và scripts (như `npm start`, `npm build`).

### `tsconfig.json`
- **Mô tả**: Cấu hình TypeScript (như strict mode, paths).

### `vite.config.ts`
- **Mô tả**: Cấu hình Vite (build tool), ví dụ: alias, plugins.


This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
