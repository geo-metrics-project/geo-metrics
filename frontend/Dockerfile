FROM node:20-alpine

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

WORKDIR /app

# Install dependencies as root
COPY package*.json ./
RUN npm ci

# Copy application files
COPY . .
RUN npm run build

# Change ownership to non-root user
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

EXPOSE 3000
CMD ["npm", "start"]