import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import './Dashboard.css';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [postContent, setPostContent] = useState('');
  const [creatingPost, setCreatingPost] = useState(false);
  const [liking, setLiking] = useState({});
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [likesList, setLikesList] = useState([]);
  const [loadingLikes, setLoadingLikes] = useState(false);
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' or 'myPosts'
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      try {
        const token = localStorage.getItem('access');
        if (!token) {
          navigate('/login');
          return;
        }

        // Fetch user profile to get ID and Admin status
        try {
          const userResponse = await api.get('auth/profile/');
          setUserId(userResponse.data.id);
          setIsAdmin(userResponse.data.is_staff);
          setUser({ email: userResponse.data.email });
          localStorage.setItem('user_id', userResponse.data.id);
        } catch (err) {
          console.warn('Could not fetch user profile:', err);
          const userEmail = localStorage.getItem('email');
          setUser({ email: userEmail || 'User' });
          const storedId = localStorage.getItem('user_id');
          if (storedId) setUserId(storedId);
        }
        
        // Fetch all posts
        const postsResponse = await api.get('posts/');
        setPosts(postsResponse.data.results);
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndPosts();
  }, [navigate]);

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`posts/${postId}/`);
        setPosts(posts.filter(post => post.id !== postId));
      } catch (err) {
        console.error('Error deleting post:', err);
        setError('Failed to delete post');
      }
    }
  };

  const handleLikeToggle = async (postId, currentlyLiked) => {
    try {
      setLiking({ ...liking, [postId]: true });
      
      await api.post(`posts/${postId}/like/`);
      
      // Update the post's like status
      setPosts(posts.map(post => 
        post.id === postId 
          ? {
              ...post,
              user_has_liked: !currentlyLiked,
              likes_count: currentlyLiked ? post.likes_count - 1 : post.likes_count + 1
            }
          : post
      ));
    } catch (err) {
      console.error('Error toggling like:', err);
      setError('Failed to update like');
    } finally {
      setLiking({ ...liking, [postId]: false });
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postContent.trim()) {
      setError('Post content cannot be empty');
      return;
    }

    try {
      setCreatingPost(true);
      const response = await api.post('posts/', {
        content: postContent,
      });
      
      // The response should have author as an object with id and email
      const newPost = {
        ...response.data,
        likes_count: response.data.likes_count || 0,
        user_has_liked: false
      };
      
      // Add the new post to the beginning of the posts list
      setPosts([newPost, ...posts]);
      setPostContent('');
      setError('');
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post');
    } finally {
      setCreatingPost(false);
    }
  };

  const handleShowLikes = async (postId) => {
    setSelectedPostId(postId);
    setShowLikesModal(true);
    setLoadingLikes(true);
    
    try {
      const response = await api.get(`posts/${postId}/likes/`);
      // Handle both paginated and direct array responses
      const likes = response.data.results || response.data;
      setLikesList(Array.isArray(likes) ? likes : []);
    } catch (err) {
      console.error('Error fetching likes:', err);
      setError('Failed to load likes');
    } finally {
      setLoadingLikes(false);
    }
  };

  const closeLikesModal = () => {
    setShowLikesModal(false);
    setSelectedPostId(null);
    setLikesList([]);
  };

  // Separate posts by author using user ID
  const currentUserIdNum = userId ? parseInt(userId) : null;
  const authorPosts = currentUserIdNum ? posts.filter(post => {
    const postAuthorId = typeof post.author === 'object' ? post.author.id : post.author;
    return postAuthorId === currentUserIdNum;
  }) : [];
  const otherPosts = currentUserIdNum ? posts.filter(post => {
    const postAuthorId = typeof post.author === 'object' ? post.author.id : post.author;
    return postAuthorId !== currentUserIdNum;
  }) : posts;
  

  const renderPostCard = (post, isOwnPost = false) => (
    <div
      key={post.id}
      className="post-card"
    >
      <div className="post-header">
        <div className="post-header-content">
          <div>
            <p className="post-author">
              @ {typeof post.author === 'object' ? post.author.email.split('@')[0] : `User #${post.author}`}
            </p>
            <small className="post-date">
              {new Date(post.created_at).toLocaleDateString()} at {new Date(post.created_at).toLocaleTimeString()}
            </small>
          </div>
          {isOwnPost && (
            <span className="own-post-badge">Your Post</span>
          )}
        </div>
      </div>
      <p className="post-content">{post.content}</p>
      
      <div className="post-footer">
        <div></div>
        
        <div className="post-actions">
          {post.likes_count > 0 && (
            <button
              onClick={() => handleShowLikes(post.id)}
              className="likes-count-btn"
            >
              👥 {post.likes_count} {post.likes_count === 1 ? 'like' : 'likes'}
            </button>
          )}

          <button
            onClick={() => handleLikeToggle(post.id, post.user_has_liked)}
            disabled={liking[post.id]}
            className={`like-btn ${post.user_has_liked ? 'liked' : ''}`}
          >
            {post.user_has_liked ? '❤️ Liked' : '🤍 Like'}
          </button>

          {(isOwnPost || isAdmin) && (
            <button
              onClick={() => handleDeletePost(post.id)}
              className="delete-btn"
              style={{ marginLeft: '10px', color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}
            >
              🗑️ Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login');
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button
          onClick={handleLogout}
          className="logout-btn"
        >
          Logout
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="welcome-box">
        <h2>Welcome!</h2>
        <p>You are successfully logged in to Mini Social App.</p>
        <p>
          <strong>Email:</strong> {localStorage.getItem('email') || 'Not available'}
        </p>
      </div>

      <div className="create-post-box">
        <h3>Create a New Post</h3>
        <form onSubmit={handleCreatePost}>
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="What's on your mind?"
          />
          <button
            type="submit"
            disabled={creatingPost || !postContent.trim()}
            className="post-btn"
          >
            {creatingPost ? 'Posting...' : 'Post'}
          </button>
        </form>
      </div>

      {/* Tabs Section */}
      <div className="tabs-container">
        <button
          onClick={() => setActiveTab('feed')}
          className={`tab-btn ${activeTab === 'feed' ? 'active' : ''}`}
        >
          Feed from Others
        </button>
        <button
          onClick={() => setActiveTab('myPosts')}
          className={`tab-btn ${activeTab === 'myPosts' ? 'active' : ''}`}
        >
          My Posts
        </button>
      </div>

      {/* Posts Display */}
      {activeTab === 'myPosts' && (
        <div className="posts-section">
          <h3>My Posts</h3>
          {authorPosts.length === 0 ? (
            <p className="no-posts">No posts yet. Create one to get started!</p>
          ) : (
            <div>
              {authorPosts.map((post) => renderPostCard(post, true))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'feed' && (
        <div className="posts-section">
          <h3>Feed from Others</h3>
          {otherPosts.length === 0 ? (
            <p className="no-posts">No posts from others yet.</p>
          ) : (
            <div>
              {otherPosts.map((post) => renderPostCard(post, false))}
            </div>
          )}
        </div>
      )}

      {showLikesModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Who liked this post</h2>
              <button
                onClick={closeLikesModal}
                className="modal-close-btn"
              >
                ✕
              </button>
            </div>

            {loadingLikes ? (
              <div className="loading-text">Loading likes...</div>
            ) : likesList.length === 0 ? (
              <div className="no-likes-text">No likes yet</div>
            ) : (
              <div>
                {likesList.map((like, index) => (
                  <div
                    key={index}
                    className="likes-list-item"
                  >
                    <div className="like-user-info">
                      <p>
                        {like.user.email}
                      </p>
                      <small>
                        {new Date(like.created_at).toLocaleDateString()} at {new Date(like.created_at).toLocaleTimeString()}
                      </small>
                    </div>
                    <span>❤️</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;