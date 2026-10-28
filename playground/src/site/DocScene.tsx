import friendsPeek from '../examples/scenes/artwork/friends-preview/friends-peek.svg';
import Motif from './Motif';
import './doc-scene.css';

/** A quiet piece of the friends' sky, reserved for the document heading. */
export default function DocScene() {
  return (
    <div className="doc-scene" aria-hidden="true">
      <svg className="doc-scene-backdrop" viewBox="0 0 250 150" fill="none" focusable="false">
        <path
          className="doc-scene-sky"
          d="M29 127C13 108 22 82 42 73c-2-28 23-46 48-38 18-25 57-23 73 1 33-8 64 14 62 47 21 8 23 32 9 46Z"
        />
        <path
          className="doc-scene-cloudbank"
          d="M10 136c-6-9 2-19 13-17 4-12 19-15 28-6 8-6 20-3 23 6 21-7 43-6 62 1 14-8 32-6 42 1 9-12 28-13 37-2 16-6 32 3 29 17-47 9-76 5-115 6-47 3-79 4-119-6Z"
        />
      </svg>
      <Motif name="cloud" className="doc-scene-cloud" />
      <Motif name="star" className="doc-scene-star" />
      <img className="doc-scene-friends" src={friendsPeek} alt="" width="440" height="170" />
      <Motif name="flower" className="doc-scene-flower" />
    </div>
  );
}
