import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Get params from URL or use defaults
  const name = searchParams.get('name') || 'Your';
  const conversations = searchParams.get('conversations') || '0';
  const activeDays = searchParams.get('days') || '0';
  const tools = searchParams.get('tools') || '0';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F7F5F0',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
          }}
        >
          <div
            style={{
              fontSize: 24,
              color: '#8B9B7E',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              marginBottom: 20,
            }}
          >
            Year in Review with Claude
          </div>

          <div
            style={{
              fontSize: 64,
              fontWeight: 500,
              color: '#2D2A26',
              marginBottom: 40,
              textAlign: 'center',
            }}
          >
            {name}
          </div>

          <div
            style={{
              display: 'flex',
              gap: '60px',
              marginBottom: 40,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 500,
                  color: '#C15F3C',
                }}
              >
                {conversations}
              </div>
              <div
                style={{
                  fontSize: 18,
                  color: '#8B9B7E',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                Conversations
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 500,
                  color: '#C15F3C',
                }}
              >
                {activeDays}
              </div>
              <div
                style={{
                  fontSize: 18,
                  color: '#8B9B7E',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                Active Days
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 500,
                  color: '#C15F3C',
                }}
              >
                {tools}
              </div>
              <div
                style={{
                  fontSize: 18,
                  color: '#8B9B7E',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                Tools Used
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginTop: 20,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: '#C15F3C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 20,
                fontWeight: 500,
              }}
            >
              C
            </div>
            <div
              style={{
                fontSize: 18,
                color: '#2D2A26',
              }}
            >
              Made with Claude
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
