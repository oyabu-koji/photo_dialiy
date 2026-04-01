import {
  __resetEntryRepository,
  createEntryRepositorySeed,
} from '../../features/entries/repositories/entryRepository';
import { __resetPhotoPickerService } from '../../features/entries/services/photoPickerService';
import { __resetVoiceRecorderService } from '../../features/entries/services/voiceRecorderService';

export function resetAppState(seed = createEntryRepositorySeed()) {
  __resetEntryRepository(seed);
  __resetPhotoPickerService();
  __resetVoiceRecorderService();
}
