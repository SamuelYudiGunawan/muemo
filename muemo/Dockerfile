FROM node:22-alpine AS builder
WORKDIR /app

ARG NEXT_PUBLIC_YOUTUBE_API_KEY
ENV NEXT_PUBLIC_YOUTUBE_API_KEY=$NEXT_PUBLIC_YOUTUBE_API_KEY

COPY . .
RUN npm install
RUN npm run build

FROM node:22-alpine
WORKDIR /app

COPY --from=builder /app ./
EXPOSE 8080
ENV PORT 8080

CMD ["npm", "start"]
