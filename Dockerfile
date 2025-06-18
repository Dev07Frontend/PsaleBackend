FROM oven/bun:latest

WORKDIR /app

# Install system dependencies first
RUN apt-get update -y && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

# Copy package files first for better caching
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Copy the rest of the files
COPY . .

# Generate Prisma client
RUN bunx prisma generate

EXPOSE 3050
CMD ["bun", "run", "start"]
