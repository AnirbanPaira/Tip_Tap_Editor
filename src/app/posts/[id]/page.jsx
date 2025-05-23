'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';
import Link from 'next/link';
import { 
  Sparkles, 
  Edit3, 
  Trash2, 
  ArrowLeft, 
  FileText, 
  Wand2, 
  Stars,
  Zap,
  Loader2,
  Calendar,
  User,
  Eye
} from 'lucide-react';

async function getPost(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/posts/${id}`);
  
  if (!res.ok) {
    throw new Error('Failed to fetch post');
  }
  
  return res.json();
}

async function deletePost(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/posts/${id}`, {
    method: 'DELETE',
  });
  
  if (!res.ok) {
    throw new Error('Failed to delete post');
  }
  
  return res.json();
}

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  
  // State for hover effects
  const [editHovered, setEditHovered] = useState(false);
  const [deleteHovered, setDeleteHovered] = useState(false);
  const [backHovered, setBackHovered] = useState(false);

  // Fixed particle positions to avoid hydration mismatch
  const particlePositions = [
    { left: '12%', top: '18%', delay: '0s' },
    { left: '88%', top: '25%', delay: '0.6s' },
    { left: '22%', top: '78%', delay: '1.1s' },
    { left: '85%', top: '65%', delay: '1.7s' },
    { left: '8%', top: '55%', delay: '2.2s' },
    { left: '75%', top: '40%', delay: '0.3s' },
    { left: '35%', top: '12%', delay: '0.9s' },
    { left: '60%', top: '82%', delay: '1.4s' },
    { left: '92%', top: '48%', delay: '1.9s' },
    { left: '28%', top: '62%', delay: '0.8s' },
  ];

  useEffect(() => {
    setIsClient(true);
    
    const fetchPost = async () => {
      try {
        const postData = await getPost(id);
        setPost(postData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this magical story? This action cannot be undone.')) {
      try {
        await deletePost(id);
        router.push('/posts');
      } catch (err) {
        console.error('Error deleting post:', err);
        alert('Failed to delete post');
      }
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

  const loadingStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '1.2rem',
    gap: '20px',
  };

  const errorStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    color: 'rgba(255, 119, 119, 0.9)',
    fontSize: '1.2rem',
    textAlign: 'center',
    gap: '20px',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '60px',
    position: 'relative',
    zIndex: 10,
  };

  const titleStyle = {
    fontSize: '4rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '20px',
    letterSpacing: '-1px',
    lineHeight: '1.1',
  };

  const postMetaStyle = {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '30px',
    marginBottom: '40px',
    flexWrap: 'wrap',
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    padding: '40px',
    marginBottom: '40px',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  };

  const contentStyle = {
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: '1.8',
    fontSize: '1.1rem',
  };

  const buttonContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '25px',
    marginTop: '50px',
    flexWrap: 'wrap',
  };

  const editButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    padding: '16px 32px',
    fontSize: '1rem',
    fontWeight: '600',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
  };

  const editButtonHoverStyle = {
    ...editButtonStyle,
    transform: 'translateY(-3px)',
    boxShadow: '0 15px 40px rgba(102, 126, 234, 0.4)',
  };

  const deleteButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    padding: '16px 32px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 30px rgba(239, 68, 68, 0.3)',
  };

  const deleteButtonHoverStyle = {
    ...deleteButtonStyle,
    transform: 'translateY(-3px)',
    boxShadow: '0 15px 40px rgba(239, 68, 68, 0.4)',
  };

  const backButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'transparent',
    color: 'rgba(255, 255, 255, 0.7)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '50px',
    padding: '14px 28px',
    fontSize: '1rem',
    fontWeight: '500',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
  };

  const backButtonHoverStyle = {
    ...backButtonStyle,
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

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={backgroundOverlayStyle}></div>
        <div style={loadingStyle}>
          <Loader2 size={48} style={{ animation: 'spin 1s linear infinite' }} />
          <span>Loading your story...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={backgroundOverlayStyle}></div>
        <div style={errorStyle}>
          <Wand2 size={48} color="rgba(255, 119, 119, 0.8)" />
          <span>Something went wrong: {error.message}</span>
          <Link href="/posts" style={backButtonStyle}>
            <ArrowLeft size={18} />
            Return to Stories
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={containerStyle}>
        <div style={backgroundOverlayStyle}></div>
        <div style={errorStyle}>
          <FileText size={48} color="rgba(255, 255, 255, 0.5)" />
          <span>Story not found.</span>
          <Link href="/posts" style={backButtonStyle}>
            <ArrowLeft size={18} />
            Return to Stories
          </Link>
        </div>
      </div>
    );
  }

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
              {post.title || 'Untitled Story'}
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
          
          {/* Post Metadata */}
          <div style={postMetaStyle}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={16} />
              {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : 'Recently'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={16} />
              Author
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={16} />
              Reading Mode
            </span>
          </div>
        </div>

        {/* Content Card */}
        <div style={cardStyle}>
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            opacity: '0.3',
          }}>
            <FileText size={24} color="white" />
          </div>
          
          <div style={contentStyle}>
            <SimpleEditor
              initialContent={post.content}
              editable={false}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={buttonContainerStyle}>
          <Link 
            href={`/posts/${post.id}/edit`}
            onMouseEnter={() => setEditHovered(true)}
            onMouseLeave={() => setEditHovered(false)}
            style={editHovered ? editButtonHoverStyle : editButtonStyle}
          >
            <Edit3 size={18} />
            Edit Story
          </Link>

          <button
            onClick={handleDelete}
            onMouseEnter={() => setDeleteHovered(true)}
            onMouseLeave={() => setDeleteHovered(false)}
            style={deleteHovered ? deleteButtonHoverStyle : deleteButtonStyle}
          >
            <Trash2 size={18} />
            Delete Story
          </button>

          <Link 
            href="/posts"
            onMouseEnter={() => setBackHovered(true)}
            onMouseLeave={() => setBackHovered(false)}
            style={backHovered ? backButtonHoverStyle : backButtonStyle}
          >
            <ArrowLeft size={18} />
            Back to Archive
          </Link>
        </div>

        {/* Decorative Footer */}
        <div style={decorativeLineStyle}>
          <div style={lineStyle}></div>
          <Sparkles size={16} />
          <span>End of story</span>
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