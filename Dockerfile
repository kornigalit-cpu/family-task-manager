# שלב 1: בניית הפרויקט
FROM node:20-alpine AS build

WORKDIR /app

# העתקת קובצי התלויות קודם לצורך ניצול Cache
COPY package*.json ./
RUN npm ci

# העתקת שאר קובצי הפרויקט ובניית תוצרי הפרודקשן
COPY . .
RUN npm run build

# שלב 2: שרת אירוח קל ומהיר (Nginx)
FROM nginx:alpine

# העתקת תוצרי הבנייה מ-Vite אל תיקיית ההגשה של Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# חשיפת פורט 80
EXPOSE 80

# הפעלת Nginx ברקע הפעיל
CMD ["nginx", "-g", "daemon off;"]