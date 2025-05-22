'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';
import Link from 'next/link';
import { 
  Sparkles, 
  Send, 
  ArrowLeft, 
  Edit3, 
  FileText, 
  Wand2, 
  Stars,
  Zap,
  Loader2,
  PenTool
} from 'lucide-react';

async function createPost({ title, content }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, content }),
  });
  if (!res.ok) {
    throw new Error('Failed to create post');
  }
  return res.json();
}

export default function CreatePostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // State for hover effects
  const [titleHovered, setTitleHovered] = useState(false);
  const [editorHovered, setEditorHovered] = useState(false);
  const [createHovered, setCreateHovered] = useState(false);
  const [cancelHovered, setCancelHovered] = useState(false);
  const [titleFocused, setTitleFocused] = useState(false);

  // Fixed particle positions to avoid hydration mismatch
  const particlePositions = [
    { left: '10%', top: '20%', delay: '0s' },
    { left: '85%', top: '15%', delay: '0.5s' },
    { left: '20%', top: '80%', delay: '1s' },
    { left: '90%', top: '70%', delay: '1.5s' },
    { left: '5%', top: '60%', delay: '2s' },
    { left: '75%', top: '40%', delay: '2.5s' },
    { left: '45%', top: '10%', delay: '3s' },
    { left: '60%', top: '85%', delay: '0.3s' },
    { left: '15%', top: '45%', delay: '0.8s' },
    { left: '80%', top: '25%', delay: '1.3s' },
    { left: '35%', top: '70%', delay: '1.8s' },
    { left: '95%', top: '50%', delay: '2.3s' },
    { left: '25%', top: '30%', delay: '2.8s' },
    { left: '70%', top: '60%', delay: '0.2s' },
    { left: '50%', top: '90%', delay: '0.7s' },
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const newPost = await createPost({ title, content: editorContent });
      router.push(`/posts/${newPost.id}`);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
      setLoading(false);
    }
  };

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

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    padding: '40px',
    marginBottom: '30px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  };

  const cardHoverStyle = {
    ...cardStyle,
    transform: 'translateY(-5px)',
    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  };

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '0.9rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '20px',
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(0, 0, 0, 0.3)',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '20px 24px',
    color: 'white',
    fontSize: '1.2rem',
    fontWeight: '400',
    outline: 'none',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
  };

  const inputFocusStyle = {
    ...inputStyle,
    border: '2px solid rgba(120, 119, 198, 0.6)',
    boxShadow: '0 0 0 4px rgba(120, 119, 198, 0.1)',
    background: 'rgba(0, 0, 0, 0.4)',
  };

  const editorContainerStyle = {
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '20px',
    padding: '30px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    minHeight: '400px',
    backdropFilter: 'blur(10px)',
  };

  const buttonContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '30px',
    marginTop: '40px',
  };

  const primaryButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    padding: '18px 36px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
    position: 'relative',
    overflow: 'hidden',
  };

  const primaryButtonHoverStyle = {
    ...primaryButtonStyle,
    transform: 'translateY(-3px)',
    boxShadow: '0 15px 40px rgba(102, 126, 234, 0.4)',
  };

  const disabledButtonStyle = {
    ...primaryButtonStyle,
    background: 'rgba(255, 255, 255, 0.1)',
    cursor: 'not-allowed',
    boxShadow: 'none',
  };

  const secondaryButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'transparent',
    color: 'rgba(255, 255, 255, 0.7)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '50px',
    padding: '16px 32px',
    fontSize: '1rem',
    fontWeight: '500',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
  };

  const secondaryButtonHoverStyle = {
    ...secondaryButtonStyle,
    color: 'white',
    border: '2px solid rgba(255, 255, 255, 0.4)',
    background: 'rgba(255, 255, 255, 0.05)',
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
              <Wand2 size={60} style={{ display: 'inline-block', marginRight: '20px', verticalAlign: 'middle' }} />
              Create Magic
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
            Where extraordinary ideas come to life
          </p>
        </div>

        {/* Title Input Card */}
        <div 
          style={titleHovered ? cardHoverStyle : cardStyle}
          onMouseEnter={() => setTitleHovered(true)}
          onMouseLeave={() => setTitleHovered(false)}
        >
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            opacity: '0.3',
          }}>
            <FileText size={24} color="white" />
          </div>
          
          <label style={labelStyle}>
            <Edit3 size={18} />
            Title of Your Masterpiece
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setTitleFocused(true)}
            onBlur={() => setTitleFocused(false)}
            placeholder="Enter something extraordinary..."
            style={titleFocused ? inputFocusStyle : inputStyle}
          />
        </div>

        {/* Editor Card */}
        <div 
          style={editorHovered ? cardHoverStyle : cardStyle}
          onMouseEnter={() => setEditorHovered(true)}
          onMouseLeave={() => setEditorHovered(false)}
        >
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            opacity: '0.3',
          }}>
            <PenTool size={24} color="white" />
          </div>
          
          <label style={labelStyle}>
            <Edit3 size={18} />
            Craft Your Story
          </label>
          <div style={editorContainerStyle}>
            <SimpleEditor
              initialContent=""
              onUpdate={(htmlContent) => setEditorContent(htmlContent)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={buttonContainerStyle}>
          <button
            onClick={handleSave}
            disabled={loading || !title.trim() || !editorContent.trim()}
            onMouseEnter={() => setCreateHovered(true)}
            onMouseLeave={() => setCreateHovered(false)}
            style={
              loading || !title.trim() || !editorContent.trim() 
                ? disabledButtonStyle 
                : createHovered 
                  ? primaryButtonHoverStyle 
                  : primaryButtonStyle
            }
          >
            {loading ? (
              <>
                <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                Creating Magic...
              </>
            ) : (
              <>
                <Send size={20} />
                Launch Creation
              </>
            )}
          </button>

          <Link 
            href="/posts"
            onMouseEnter={() => setCancelHovered(true)}
            onMouseLeave={() => setCancelHovered(false)}
            style={cancelHovered ? secondaryButtonHoverStyle : secondaryButtonStyle}
          >
            <ArrowLeft size={18} />
            Return
          </Link>
        </div>

        {/* Decorative Footer */}
        <div style={decorativeLineStyle}>
          <div style={lineStyle}></div>
          <Sparkles size={16} />
          <span>Where creativity meets innovation</span>
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
        
        input::placeholder {
          color: rgba(255, 255, 255, 0.4);
          font-style: italic;
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