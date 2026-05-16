import React, { useEffect, useState } from 'react';
import Service from '../../utils/http';
import { Button, Table, Badge, ActionIcon, Modal, TextInput, Group, Select } from '@mantine/core';
import { IconTrash, IconCopy, IconQrcode } from '@tabler/icons-react';

export default function MyUrls() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ opened: false, urlId: null });
  const [qrModal, setQrModal] = useState({ opened: false, qrCode: null, shortCode: null });
  const service = new Service();
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUserUrls();
  }, []);

  const fetchUserUrls = async () => {
    try {
      setLoading(true);
      const response = await service.get('s/user/all');
      if (response.urls) {
        setUrls(response.urls);
      }
    } catch (error) {
      console.error('Error fetching URLs:', error);
      alert('Failed to load your URLs');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    alert('URL copied to clipboard!');
  };

  const downloadQRCode = (qrCode, shortCode) => {
    if (!qrCode) return;
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `qr-${shortCode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isExpired = (expiresAt) => {
    if (!expiresAt) return false;
    return new Date() > new Date(expiresAt);
  };

  const truncateUrl = (url) => {
    if (url.length > 30) {
      return url.substring(0, 30) + '...';
    }
    return url;
  };

  const getFilteredAndSortedUrls = () => {
    let filtered = urls;

    // Filter by status
    if (filterStatus === 'active') {
      filtered = filtered.filter((url) => url.isActive && !isExpired(url.expiresAt));
    } else if (filterStatus === 'expired') {
      filtered = filtered.filter((url) => isExpired(url.expiresAt));
    }

    // Sort
    const sorted = [...filtered];
    if (sortBy === 'newest') {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'oldest') {
      sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === 'clicks') {
      sorted.sort((a, b) => b.clickCount - a.clickCount);
    } else if (sortBy === 'expiring-soon') {
      sorted.sort((a, b) => {
        if (!a.expiresAt) return 1;
        if (!b.expiresAt) return -1;
        return new Date(a.expiresAt) - new Date(b.expiresAt);
      });
    }

    return sorted;
  };

  const displayUrls = getFilteredAndSortedUrls();

  // Calculate pagination
  const totalPages = Math.ceil(displayUrls.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUrls = displayUrls.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, filterStatus]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading your URLs...</div>;
  }

  if (urls.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2>No URLs created yet</h2>
        <p>Start by creating your first shortened URL!</p>
      </div>
    );
  }

  const rows = paginatedUrls.map((url) => {
    const expired = isExpired(url.expiresAt);
    return (
      <Table.Tr key={url._id}>
        <Table.Td>
          <strong>{url.title || 'Untitled'}</strong>
        </Table.Td>
        <Table.Td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <a 
            href={url.originalUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#007bff', textDecoration: 'none' }}
            title={url.originalUrl}
          >
            {truncateUrl(url.originalUrl)}
          </a>
        </Table.Td>
        <Table.Td>
          <a 
            href={url.shortUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#007bff', textDecoration: 'none', cursor: 'pointer' }}
            title="Click to open shortened URL"
          >
            <code>{url.shortCode}</code>
          </a>
        </Table.Td>
        <Table.Td>{url.clickCount}</Table.Td>
        <Table.Td>{formatDate(url.createdAt)}</Table.Td>
        <Table.Td>
          {url.expiresAt ? (
            <Badge color={expired ? 'red' : 'blue'}>
              {expired ? 'Expired' : formatDate(url.expiresAt)}
            </Badge>
          ) : (
            <Badge color="gray">No expiry</Badge>
          )}
        </Table.Td>
        <Table.Td>
          <Group gap="xs">
            {url.qrCode && (
              <ActionIcon
                variant="light"
                color="purple"
                onClick={() => setQrModal({ opened: true, qrCode: url.qrCode, shortCode: url.shortCode })}
                title="View QR Code"
              >
                <IconQrcode size={16} />
              </ActionIcon>
            )}
            <ActionIcon
              variant="light"
              color="blue"
              onClick={() => copyToClipboard(url.shortUrl)}
              title="Copy URL"
            >
              <IconCopy size={16} />
            </ActionIcon>
            <ActionIcon
              variant="light"
              color="red"
              onClick={() => setDeleteModal({ opened: true, urlId: url._id })}
              title="Delete URL"
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Group>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <div style={{ padding: '20px' }}>
      <h1>My Shortened URLs</h1>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
        <Select
          label="Sort by"
          value={sortBy}
          onChange={(value) => setSortBy(value)}
          data={[
            { value: 'newest', label: 'Newest First' },
            { value: 'oldest', label: 'Oldest First' },
            { value: 'clicks', label: 'Most Clicks' },
            { value: 'expiring-soon', label: 'Expiring Soon' },
          ]}
          style={{ flex: 1, maxWidth: '200px' }}
        />
        
        <Select
          label="Filter by"
          value={filterStatus}
          onChange={(value) => setFilterStatus(value)}
          data={[
            { value: 'all', label: 'All URLs' },
            { value: 'active', label: 'Active Only' },
            { value: 'expired', label: 'Expired Only' },
          ]}
          style={{ flex: 1, maxWidth: '200px' }}
        />
      </div>

      {displayUrls.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          No URLs match your filter
        </div>
      ) : (
        <>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Title</Table.Th>
                <Table.Th>Original URL</Table.Th>
                <Table.Th>Short Code</Table.Th>
                <Table.Th>Clicks</Table.Th>
                <Table.Th>Created</Table.Th>
                <Table.Th>Expires</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
          
          <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: '#666' }}>
              Showing {startIndex + 1}-{Math.min(endIndex, displayUrls.length)} of {displayUrls.length} URLs
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Button
                variant="default"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              <div style={{ 
                padding: '8px 12px', 
                border: '1px solid #ddd', 
                borderRadius: '4px',
                minWidth: '60px',
                textAlign: 'center',
                fontWeight: 600
              }}>
                Page {currentPage} of {totalPages || 1}
              </div>
              
              <Button
                variant="default"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      <Modal
        opened={deleteModal.opened}
        onClose={() => setDeleteModal({ opened: false, urlId: null })}
        title="Delete URL"
      >
        <p>Are you sure you want to delete this URL?</p>
        <Group>
          <Button color="red" onClick={() => {
            // Handle deletion
            setDeleteModal({ opened: false, urlId: null });
          }}>
            Delete
          </Button>
          <Button onClick={() => setDeleteModal({ opened: false, urlId: null })}>
            Cancel
          </Button>
        </Group>
      </Modal>

      <Modal
        opened={qrModal.opened}
        onClose={() => setQrModal({ opened: false, qrCode: null, shortCode: null })}
        title={`QR Code for ${qrModal.shortCode}`}
        centered
      >
        <div style={{ textAlign: 'center' }}>
          {qrModal.qrCode && (
            <>
              <img 
                src={qrModal.qrCode} 
                alt="QR Code" 
                style={{ width: '300px', height: '300px', margin: '20px 0' }}
              />
              <div style={{ marginTop: '20px' }}>
                <Button 
                  fullWidth
                  onClick={() => downloadQRCode(qrModal.qrCode, qrModal.shortCode)}
                  color="green"
                >
                  Download QR Code
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
