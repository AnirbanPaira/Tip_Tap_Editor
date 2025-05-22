'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Plus, 
  BookOpen, 
  Edit3, 
  FileText, 
  Wand2, 
  Stars,
  Zap,
  ArrowRight,
  Calendar,
  User
} from 'lucide-react';

async function getPosts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/posts`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  return res.json();
}

export default function PostsPage({ posts: initialPosts }) {
  const [posts, setPosts] = useState(initialPosts || []);
  const [isClient, setIsClient] = useState(false);
  const [hoveredPost, setHoveredPost] = useState(null);
  const [createHovered, setCreateHovered] = useState(false);

  // Fixed particle positions to avoid hydration mismatch
  const particlePositions = [
    { left: '15%', top: '25%', delay: '0s' },
    { left: '80%', top: '20%', delay: '0.7s' },
    { left: '25%', top: '75%', delay: '1.2s' },
    { left: '85%', top: '60%', delay: '1.8s' },
    { left: '10%', top: '50%', delay: '2.4s' },
    { left: '70%', top: '35%', delay: '0.4s' },
    { left: '40%', top: '15%', delay: '1.1s' },
    { left: '55%', top: '80%', delay: '1.6s' },
    { left: '90%', top: '45%', delay: '2.1s' },
    { left: '30%', top: '60%', delay: '0.9s' },
  ];

  useEffect(() => {
    setIsClient(true);
    // Fetch posts if not provided via props
    if (!initialPosts) {
      getPosts().then(setPosts).catch(console.error);
    }
  }, [initialPosts]);

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #1a1a2e 75%, #0f0f23 100%)',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  };

  const backgroundOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%)
    `,
    animation: 'breathe 8s ease-in-out infinite',
  };

  const floatingOrbStyle = (delay = '0s', size = '200px', color = 'rgba(120, 119, 198, 0.1)') => ({
    position: 'absolute',
    width: size,
    height: size,
    borderRadius: '50%',
    background: color,
    filter: 'blur(40px)',
    animation: `float 12s ease-in-out infinite ${delay}`,
  });

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '60px',
    position: 'relative',
    zIndex: 10,
  };

  const titleStyle = {
    fontSize: '4.5rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '20px',
    letterSpacing: '-2px',
    lineHeight: '1.1',
  };

  const subtitleStyle = {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '1.3rem',
    fontWeight: '300',
    letterSpacing: '1px',
  };

  const postsContainerStyle = {
    display: 'grid',
    gap: '30px',
    marginBottom: '60px',
  };

  const postCardStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    padding: '30px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
  };

  const postCardHoverStyle = {
    ...postCardStyle,
    transform: 'translateY(-8px)',
    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    background: 'rgba(255, 255, 255, 0.08)',
  };

  const postTitleStyle = {
    color: 'white',
    fontSize: '1.8rem',
    fontWeight: '700',
    marginBottom: '15px',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    lineHeight: '1.3',
  };

  const postMetaStyle = {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '15px',
  };

  const readMoreStyle = {
    color: 'rgba(120, 119, 198, 0.8)',
    fontSize: '0.95rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
  };

  const readMoreHoverStyle = {
    ...readMoreStyle,
    color: 'rgba(120, 119, 198, 1)',
    transform: 'translateX(5px)',
  };

  const createButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    padding: '20px 40px',
    fontSize: '1.2rem',
    fontWeight: '600',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 15px 35px rgba(102, 126, 234, 0.3)',
    position: 'relative',
    overflow: 'hidden',
    margin: '0 auto',
    width: 'fit-content',
  };

  const createButtonHoverStyle = {
    ...createButtonStyle,
    transform: 'translateY(-3px)',
    boxShadow: '0 20px 45px rgba(102, 126, 234, 0.4)',
  };

  const emptyStateStyle = {
    textAlign: 'center',
    padding: '80px 40px',
    color: 'rgba(255, 255, 255, 0.6)',
  };

  const decorativeLineStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    justifyContent: 'center',
    marginTop: '60px',
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: '0.85rem',
    fontWeight: '300',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  };

  const lineStyle = {
    width: '60px',
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
  };

  return (
    <div style={containerStyle}>
      {/* Animated Background */}
      <div style={backgroundOverlayStyle}></div>
      
      {/* Floating Orbs */}
      <div style={{...floatingOrbStyle('0s', '300px', 'rgba(120, 119, 198, 0.08)'), top: '-150px', right: '-150px'}}></div>
      <div style={{...floatingOrbStyle('4s', '250px', 'rgba(255, 119, 198, 0.06)'), bottom: '-125px', left: '-125px'}}></div>
      <div style={{...floatingOrbStyle('2s', '200px', 'rgba(120, 219, 255, 0.05)'), top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}></div>

      {/* Floating Particles - Only render on client */}
      {isClient && particlePositions.map((particle, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: '4px',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.6)',
            borderRadius: '50%',
            left: particle.left,
            top: particle.top,
            animation: `twinkle 3s ease-in-out infinite ${particle.delay}`,
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
          }}
        ></div>
      ))}

      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              animation: 'spin 10s linear infinite',
            }}>
              <Stars size={32} color="rgba(255, 255, 255, 0.4)" />
            </div>
            <h1 style={titleStyle}>
              <BookOpen size={60} style={{ display: 'inline-block', marginRight: '20px', verticalAlign: 'middle' }} />
              Story Archive
            </h1>
            <div style={{
              position: 'absolute',
              bottom: '-20px',
              left: '-20px',
              animation: 'pulse 2s ease-in-out infinite',
            }}>
              <Sparkles size={28} color="rgba(255, 255, 255, 0.3)" />
            </div>
          </div>
          <p style={subtitleStyle}>
            <Zap size={20} style={{ display: 'inline-block', marginRight: '10px', verticalAlign: 'middle' }} />
            A collection of extraordinary tales
          </p>
        </div>

        {/* Posts List */}
        {posts && posts.length > 0 ? (
          <div style={postsContainerStyle}>
            {posts.map((post) => (
              <Link 
                key={post.id} 
                href={`/posts/${post.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div 
                  style={hoveredPost === post.id ? postCardHoverStyle : postCardStyle}
                  onMouseEnter={() => setHoveredPost(post.id)}
                  onMouseLeave={() => setHoveredPost(null)}
                >
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    opacity: '0.3',
                  }}>
                    <FileText size={24} color="white" />
                  </div>
                  
                  <h2 style={postTitleStyle}>
                    <Edit3 size={24} color="rgba(120, 119, 198, 0.8)" />
                    {post.title || 'Untitled Story'}
                  </h2>
                  
                  <div style={postMetaStyle}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} />
                      {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recently'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={14} />
                      Author
                    </span>
                  </div>
                  
                  <div style={hoveredPost === post.id ? readMoreHoverStyle : readMoreStyle}>
                    <span>Continue reading</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={emptyStateStyle}>
            <Wand2 size={80} color="rgba(255, 255, 255, 0.3)" style={{ marginBottom: '30px' }} />
            <h3 style={{ 
              fontSize: '2rem', 
              fontWeight: '600', 
              marginBottom: '15px',
              color: 'rgba(255, 255, 255, 0.7)'
            }}>
              No Stories Yet
            </h3>
            <p style={{ 
              fontSize: '1.1rem', 
              marginBottom: '30px',
              color: 'rgba(255, 255, 255, 0.5)'
            }}>
              The archive awaits your first masterpiece
            </p>
          </div>
        )}

        {/* Create New Post Button */}
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <Link 
            href="/posts/create"
            onMouseEnter={() => setCreateHovered(true)}
            onMouseLeave={() => setCreateHovered(false)}
            style={createHovered ? createButtonHoverStyle : createButtonStyle}
          >
            <Plus size={24} />
            Begin New Story
          </Link>
        </div>

        {/* Decorative Footer */}
        <div style={decorativeLineStyle}>
          <div style={lineStyle}></div>
          <Sparkles size={16} />
          <span>Where stories live forever</span>
          <Sparkles size={16} />
          <div style={lineStyle}></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes breathe {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.1); }
        }
        
        @keyframes twinkle {
          0%, 100% { 
            opacity: 0.3; 
            transform: scale(1);
          }
          50% { 
            opacity: 1; 
            transform: scale(1.5);
          }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { 
            opacity: 0.4; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.8; 
            transform: scale(1.1);
          }
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #764ba2, #f093fb);  
        }
      `}</style>
    </div>
  );
}