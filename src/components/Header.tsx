import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Plus, User, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { CreatePlaylistDialog } from './CreatePlaylistDialog';
import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import { setSearchQuery, searchTracksRequest } from '../store/slices/searchSlice';

export const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { query } = useSelector((state: RootState) => state.search);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    dispatch(setSearchQuery(newQuery));
    
    if (newQuery.trim()) {
      dispatch(searchTracksRequest({ query: newQuery, offset: 0 }));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-spotify-black text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-spotify-green">
            Spotify Playlist Manager
          </h1>
        </div>

        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search for tracks..."
              value={query}
              onChange={handleSearchChange}
              className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-spotify-green"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            variant="spotify"
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Playlist</span>
          </Button>

          <div className="flex items-center space-x-2 text-sm">
            <User className="h-4 w-4" />
            <span>{user?.display_name}</span>
          </div>

          <Button
            onClick={handleLogout}
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CreatePlaylistDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </header>
  );
};