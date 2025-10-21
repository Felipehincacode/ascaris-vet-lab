import React, { createContext, useContext, useState, ReactNode } from 'react';

interface VideoState {
  playing: boolean;
  progress: number;
  finished: boolean;
}

interface ModalState {
  videoPresentation: boolean;
  test: boolean;
  imageDetail: boolean;
}

interface PodcastState {
  playing: boolean;
  currentTime: number;
  duration: number;
  minimized: boolean;
}

interface GlobalContextType {
  videoState: VideoState;
  setVideoState: React.Dispatch<React.SetStateAction<VideoState>>;
  modalState: ModalState;
  setModalState: React.Dispatch<React.SetStateAction<ModalState>>;
  podcastState: PodcastState;
  setPodcastState: React.Dispatch<React.SetStateAction<PodcastState>>;
  testProgress: { current: number; total: number; score: number };
  setTestProgress: React.Dispatch<React.SetStateAction<{ current: number; total: number; score: number }>>;
  selectedImage: { src: string; metadata: any } | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<{ src: string; metadata: any } | null>>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [videoState, setVideoState] = useState<VideoState>({
    playing: false,
    progress: 0,
    finished: false,
  });

  const [modalState, setModalState] = useState<ModalState>({
    videoPresentation: false,
    test: false,
    imageDetail: false,
  });

  const [podcastState, setPodcastState] = useState<PodcastState>({
    playing: false,
    currentTime: 0,
    duration: 0,
    minimized: false,
  });

  const [testProgress, setTestProgress] = useState({
    current: 0,
    total: 12,
    score: 0,
  });

  const [selectedImage, setSelectedImage] = useState<{ src: string; metadata: any } | null>(null);

  return (
    <GlobalContext.Provider
      value={{
        videoState,
        setVideoState,
        modalState,
        setModalState,
        podcastState,
        setPodcastState,
        testProgress,
        setTestProgress,
        selectedImage,
        setSelectedImage,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
};
