# Weather App

This is a modern weather application built with the [T3 Stack](https://create.t3.gg/), providing real-time weather information with a clean, responsive interface.

## Features

- **Real-time Weather Data**: Get current weather conditions for any location
- **Forecast**: View detailed forecasts for the upcoming days
- **Location Search**: Search for weather by city name or postal code
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark/Light Mode**: Choose your preferred theme for comfortable viewing

## Tech Stack

This project leverages the powerful T3 Stack:

- [Next.js](https://nextjs.org) - React framework for server-rendered applications
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Geist](https://geist.dev/) - Beautiful typography and UI components
- [Zod](https://zod.dev/) - TypeScript-first schema validation

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/weatherapp.git
   cd weatherapp
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory and add your API keys:

   ```
   NEXT_PUBLIC_WEATHER_API_KEY=your_weather_api_key
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Development

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run format:write` - Format code with Prettier
- `npm run typecheck` - Check TypeScript types

## Deployment

Follow our deployment guides for:

- [Vercel](https://create.t3.gg/en/deployment/vercel)
- [Netlify](https://create.t3.gg/en/deployment/netlify)
- [Docker](https://create.t3.gg/en/deployment/docker)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Weather data provided by [Weather API Provider]
- Icons by [Icon Provider]
- Inspired by [Inspiration Source]
