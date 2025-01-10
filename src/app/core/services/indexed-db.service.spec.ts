import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TrackService } from '../services/indexed-db.service';
import { MusicCategory, Track } from '../models/track';
import { firstValueFrom } from 'rxjs';

fdescribe('TrackService', () => {
  let service: TrackService;
  let mockTrack: Track;
  let mockAudioBlob: Blob;
  let mockImageBlob: Blob;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [TrackService]
    });
    
    service = TestBed.inject(TrackService);

    // Attendre que la base de données soit initialisée avant de continuer
    await new Promise<void>((resolve) => {
      const subscription = service.dbReady$.subscribe(ready => {
        if (ready) {
          subscription.unsubscribe();
          resolve();
        }
      });
    });

    // Créer des données de test
    mockTrack = {
      id: '123',
      title: 'Test Track',
      artist: 'Test Artist',
      addedAt: new Date(),
      fileUrl :"https://resources.tidal.com/images/80eac951/b6ac/4fc4/8da5/3814286f23ca/1280x720.jpg",
      category : MusicCategory.CHAABI,
      duration : 3
    };

    mockAudioBlob = new Blob(['test audio'], { type: 'audio/mp3' });
    mockImageBlob = new Blob(['test image'], { type: 'image/jpeg' });
  });

  afterEach(async () => {
    // Nettoyer la base de données après chaque test
    if (service.dbReady$.value) {
      try {
        await firstValueFrom(service.deleteTrack(mockTrack.id));
      } catch (error) {
        // Ignorer les erreurs de suppression si le track n'existe pas
      }
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize the database', () => {
    expect(service.dbReady$.value).toBe(true);
  });

  it('should add a track with audio and image', async () => {
    const result = await firstValueFrom(
      service.addTrack(mockTrack, mockAudioBlob, mockImageBlob)
    );

    expect(result).toBeTruthy();
    expect(result.id).toBe(mockTrack.id);
    expect(result.title).toBe(mockTrack.title);
    expect(result.artist).toBe(mockTrack.artist);
  });

  it('should get track by id', async () => {
    await firstValueFrom(service.addTrack(mockTrack, mockAudioBlob));

    const retrievedTrack = await firstValueFrom(service.getTrackById(mockTrack.id));

    expect(retrievedTrack).toBeTruthy();
    expect(retrievedTrack?.id).toBe(mockTrack.id);
    expect(retrievedTrack?.title).toBe(mockTrack.title);
  });

  it('should update track metadata', async () => {
    await firstValueFrom(service.addTrack(mockTrack, mockAudioBlob));

    const updatedTrack = { ...mockTrack, title: 'Updated Title' };
    const result = await firstValueFrom(service.updateTrackMetadata(updatedTrack));

    expect(result.title).toBe('Updated Title');
  });

  it('should delete a track', async () => {
    await firstValueFrom(service.addTrack(mockTrack, mockAudioBlob));

    await firstValueFrom(service.deleteTrack(mockTrack.id));

    const retrievedTrack = await firstValueFrom(service.getTrackById(mockTrack.id));
    expect(retrievedTrack).toBeUndefined();
  });

  it('should get all tracks metadata', async () => {
    await firstValueFrom(service.addTrack(mockTrack, mockAudioBlob));
    await firstValueFrom(service.addTrack({
      ...mockTrack,
      id: '456',
      title: 'Second Track'
    }, mockAudioBlob));

    const tracks = await firstValueFrom(service.getAllTrackMetadata());
    expect(tracks.length).toBeGreaterThanOrEqual(2);

    await firstValueFrom(service.deleteTrack('456'));
  });

  it('should reject invalid audio file type', async () => {
    const invalidAudioBlob = new Blob(['test'], { type: 'text/plain' });
    
    try {
      await firstValueFrom(service.saveAudioFile('123', invalidAudioBlob));
      fail('Should have thrown an error');
    } catch (error: any) {
      expect(error.message).toContain('Invalid file type');
    }
  });

  it('should reject invalid image file type', async () => {
    const invalidImageBlob = new Blob(['test'], { type: 'text/plain' });
    
    try {
      await firstValueFrom(service.saveImageFile('123', invalidImageBlob));
      fail('Should have thrown an error');
    } catch (error: any) {
      expect(error.message).toContain('Invalid file type');
    }
  });
});