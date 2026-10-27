import { useState } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { Button } from 'yahha-ui';
import './character-study.css';

const initialHero = new URL(
  '../examples/scenes/artwork/friends-preview/previous/friends-hero.svg',
  import.meta.url,
).href;
const roundTwoHero = new URL(
  '../examples/scenes/artwork/friends-preview/previous/round-2/friends-hero.svg',
  import.meta.url,
).href;
const previousRoundHero = new URL(
  '../examples/scenes/artwork/friends-preview/previous/round-3/friends-hero.svg',
  import.meta.url,
).href;
const afterHero = new URL(
  '../examples/scenes/artwork/friends-preview/friends-hero.svg',
  import.meta.url,
).href;
const rejectedHero = new URL(
  '../examples/scenes/artwork/friends-preview/previous/rejected-round-4/friends-hero.svg',
  import.meta.url,
).href;

const historyVersions = [
  {
    id: 'rejected4',
    label: '已撤回 v4',
    src: rejectedHero,
    description: '被否决的扁脸改动，仅保留作记录',
    alt: '已撤回 v4：本轮未采用的吉伊扁脸版本。',
  },
  {
    id: 'round3',
    label: '上一轮细修稿 v3',
    src: previousRoundHero,
    description: '当前恢复的造型来源',
    alt: '上一轮细修稿 v3：当前已恢复的三人小站场景。',
  },
  {
    id: 'round2',
    label: '校准稿 v2',
    src: roundTwoHero,
    description: '此前保留的造型校准版本',
    alt: '校准稿 v2：此前保留的三人小站场景。',
  },
  {
    id: 'initial',
    label: '最初草稿 v1',
    src: initialHero,
    description: '细小眼珠与点状高光',
    alt: '最初草稿 v1：三位角色使用细小眼珠与点状高光的小站场景。',
  },
] as const;

const characters = [
  {
    name: '吉伊',
    id: 'chiikawa',
    beforeBright: new URL(
      '../examples/scenes/artwork/friends-preview/previous/rejected-round-4/portraits/chiikawa-bright.svg',
      import.meta.url,
    ).href,
    detail: '圆耳、柔和弧眉与小小的嘴。',
    expressions: [
      {
        name: '自然睁眼',
        id: 'bright',
        src: new URL(
          '../examples/scenes/artwork/friends-preview/portraits/chiikawa-bright.svg',
          import.meta.url,
        ).href,
      },
      {
        name: '闭眼笑',
        id: 'smile',
        src: new URL(
          '../examples/scenes/artwork/friends-preview/portraits/chiikawa-smile.svg',
          import.meta.url,
        ).href,
      },
      {
        name: '惊讶',
        id: 'surprised',
        src: new URL(
          '../examples/scenes/artwork/friends-preview/portraits/chiikawa-surprised.svg',
          import.meta.url,
        ).href,
      },
    ],
  },
  {
    name: '小八',
    id: 'hachiware',
    beforeBright: new URL(
      '../examples/scenes/artwork/friends-preview/previous/rejected-round-4/portraits/hachiware-bright.svg',
      import.meta.url,
    ).href,
    detail: '八字额纹、短猫耳与点状眉。',
    expressions: [
      {
        name: '自然睁眼',
        id: 'bright',
        src: new URL(
          '../examples/scenes/artwork/friends-preview/portraits/hachiware-bright.svg',
          import.meta.url,
        ).href,
      },
      {
        name: '闭眼笑',
        id: 'smile',
        src: new URL(
          '../examples/scenes/artwork/friends-preview/portraits/hachiware-smile.svg',
          import.meta.url,
        ).href,
      },
      {
        name: '惊讶',
        id: 'surprised',
        src: new URL(
          '../examples/scenes/artwork/friends-preview/portraits/hachiware-surprised.svg',
          import.meta.url,
        ).href,
      },
    ],
  },
  {
    name: '乌萨奇',
    id: 'usagi',
    beforeBright: new URL(
      '../examples/scenes/artwork/friends-preview/previous/rejected-round-4/portraits/usagi-bright.svg',
      import.meta.url,
    ).href,
    detail: '长耳、垂弧眉与独立的下唇。',
    expressions: [
      {
        name: '自然睁眼',
        id: 'bright',
        src: new URL(
          '../examples/scenes/artwork/friends-preview/portraits/usagi-bright.svg',
          import.meta.url,
        ).href,
      },
      {
        name: '闭眼笑',
        id: 'smile',
        src: new URL(
          '../examples/scenes/artwork/friends-preview/portraits/usagi-smile.svg',
          import.meta.url,
        ).href,
      },
      {
        name: '惊讶',
        id: 'surprised',
        src: new URL(
          '../examples/scenes/artwork/friends-preview/portraits/usagi-surprised.svg',
          import.meta.url,
        ).href,
      },
    ],
  },
];

export default function CharacterStudy() {
  const [small, setSmall] = useState(false);
  const [history, setHistory] = useState<(typeof historyVersions)[number]['id']>('rejected4');
  const [detailCharacter, setDetailCharacter] = useState(0);
  const selectedCharacter = characters[detailCharacter];
  const selectedHistory =
    historyVersions.find((version) => version.id === history) ?? historyVersions[0];

  return (
    <div className="cs-page">
      <header className="cs-intro">
        <p className="cs-kicker">v4 已撤回 · 当前恢复 v3</p>
        <h1>人物对照 · 已恢复 v3</h1>
        <p>
          已恢复
          v3。恢复旧稿不代表圆润问题已经解决；本轮暂停继续改造型，保留页面构图和此前其他改进。
        </p>
      </header>

      <section className="cs-comparison" aria-labelledby="cs-comparison-title">
        <div className="cs-model-tools">
          <div className="cs-section-heading">
            <h2 id="cs-comparison-title">撤回前后对照</h2>
            <p>同一场景画幅，左侧可切换保留的历史版本。</p>
          </div>
          <div className="cs-history-switch" aria-label="左侧历史版本">
            {historyVersions.map((version) => (
              <Button
                key={version.id}
                size="sm"
                variant={history === version.id ? 'primary' : 'secondary'}
                aria-pressed={history === version.id}
                onClick={() => setHistory(version.id)}
              >
                {version.label}
              </Button>
            ))}
          </div>
        </div>
        <div className="cs-scene-pair">
          <figure>
            <figcaption>
              <strong>{selectedHistory.label}</strong>
              <span>{selectedHistory.description}</span>
            </figcaption>
            <div className="cs-scene-stage">
              <img src={selectedHistory.src} width="760" height="530" alt={selectedHistory.alt} />
            </div>
          </figure>
          <figure>
            <figcaption>
              <strong>已恢复 v3</strong>
              <span>撤回扁脸改动，暂不继续重画</span>
            </figcaption>
            <div className="cs-scene-stage">
              <img
                src={afterHero}
                width="760"
                height="530"
                alt="已恢复 v3：撤回 v4 脸型改动后的三人小站场景。"
              />
            </div>
          </figure>
        </div>
      </section>

      <section className="cs-heads" aria-labelledby="cs-heads-title">
        <div className="cs-section-heading">
          <h2 id="cs-heads-title">吉伊完整头脸轮廓</h2>
          <p>一起看圆耳、额头、两颊，以及头脸和短身体如何衔接。</p>
        </div>
        <p className="cs-detail-note" id="cs-heads-note">
          左侧固定为已撤回 v4，右侧为已恢复 v3，使用相同画幅、比例和裁框，不单独拉伸。
          这里保留完整头耳至脸身衔接，裁去下半身；完整形象在下方样张中。
        </p>
        <div className="cs-detail-pair cs-head-pair" aria-describedby="cs-heads-note">
          <figure>
            <figcaption>已撤回 v4 · 吉伊</figcaption>
            <div className="cs-head-window">
              <img
                src={characters[0].beforeBright}
                width="220"
                height="310"
                alt="已撤回 v4 的吉伊头脸轮廓，等比例观察。"
              />
            </div>
          </figure>
          <figure>
            <figcaption>已恢复 v3 · 吉伊</figcaption>
            <div className="cs-head-window">
              <img
                src={characters[0].expressions[0].src}
                width="220"
                height="310"
                alt="已恢复 v3 的吉伊头脸轮廓，与左侧采用相同画幅和比例。"
              />
            </div>
          </figure>
        </div>
      </section>

      <section className="cs-details" aria-labelledby="cs-details-title">
        <div className="cs-model-tools">
          <div className="cs-section-heading">
            <h2 id="cs-details-title">等比例五官放大</h2>
            <p>左侧固定为已撤回 v4，右侧为已恢复 v3，仅作撤回记录。</p>
          </div>
          <div className="cs-detail-switch" aria-label="五官对照角色">
            {characters.map((character, index) => (
              <Button
                key={character.id}
                size="sm"
                variant={detailCharacter === index ? 'primary' : 'secondary'}
                aria-pressed={detailCharacter === index}
                onClick={() => setDetailCharacter(index)}
              >
                {character.name}
              </Button>
            ))}
          </div>
        </div>
        <p className="cs-detail-note">
          两侧使用相同画幅、比例与裁框，仅展示五官局部。完整头耳请看上方轮廓区，各表情见下方样张。
        </p>
        <p className="cs-detail-note" role="status">
          {selectedCharacter.id === 'chiikawa'
            ? '吉伊已恢复 v3，圆润问题仍待重新判断，当前暂停继续修改。'
            : `${selectedCharacter.name}造型保持，左右用于核对一致性。`}
        </p>
        <div className="cs-detail-pair">
          <figure>
            <figcaption>已撤回 v4 · {selectedCharacter.name}</figcaption>
            <div className="cs-face-window">
              <img
                src={selectedCharacter.beforeBright}
                width="220"
                height="310"
                alt={`${selectedCharacter.name}已撤回 v4 的五官局部，等比例放大。`}
              />
            </div>
          </figure>
          <figure>
            <figcaption>已恢复 v3 · {selectedCharacter.name}</figcaption>
            <div className="cs-face-window">
              <img
                src={selectedCharacter.expressions[0].src}
                width="220"
                height="310"
                alt={`${selectedCharacter.name}已恢复 v3 的五官局部，使用与左侧相同的比例。`}
              />
            </div>
          </figure>
        </div>
      </section>

      <section
        className="cs-models"
        aria-labelledby="cs-models-title"
        data-size={small ? 'small' : 'normal'}
      >
        <div className="cs-model-tools">
          <div className="cs-section-heading">
            <h2 id="cs-models-title">三位朋友，三种表情。</h2>
            <p>放在一起比较，也缩小到实际使用尺寸看看。</p>
          </div>
          <div className="cs-size-switch" aria-label="人物预览尺寸">
            <Button
              size="sm"
              variant={small ? 'secondary' : 'primary'}
              aria-pressed={!small}
              onClick={() => setSmall(false)}
            >
              正常预览
            </Button>
            <Button
              size="sm"
              variant={small ? 'primary' : 'secondary'}
              aria-pressed={small}
              onClick={() => setSmall(true)}
            >
              小尺寸预览
            </Button>
          </div>
        </div>
        <p className="cs-size-note" role="status">
          {small
            ? '小尺寸：人物画布宽 72px，检查五官与轮廓的辨识度。'
            : '正常尺寸：人物画布最大宽 180px，窄屏按可用空间缩放。'}
        </p>
        <div className="cs-character-grid">
          {characters.map((character) => (
            <section
              className="cs-character"
              key={character.id}
              aria-labelledby={`cs-${character.id}-title`}
            >
              <header>
                <h3 id={`cs-${character.id}-title`}>{character.name}</h3>
                <p>{character.detail}</p>
              </header>
              <div className="cs-expression-list">
                {character.expressions.map((expression) => (
                  <figure className="cs-expression" key={expression.id}>
                    <figcaption>{expression.name}</figcaption>
                    <div className="cs-portrait-stage">
                      <img
                        src={expression.src}
                        width="180"
                        height="252"
                        loading="lazy"
                        alt={`${character.name}：${expression.name}，已恢复的 v3 样张。`}
                      />
                    </div>
                    <a
                      href={expression.src}
                      download={`${character.id}-${expression.id}.svg`}
                      aria-label={`下载${character.name}${expression.name} SVG`}
                    >
                      下载 SVG <ArrowDown size={13} aria-hidden="true" />
                    </a>
                  </figure>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="cs-notes" aria-labelledby="cs-notes-title">
        <div>
          <h2 id="cs-notes-title">当前状态</h2>
          <ul>
            <li>
              <strong>已撤回：</strong>v4 将圆润误处理成扁宽，不作为采用方案。
            </li>
            <li>
              <strong>已恢复：</strong>当前人物素材恢复到 v3，保留此前其他改进。
            </li>
            <li>
              <strong>问题仍在：</strong>恢复旧稿不代表圆润问题已解决，本轮暂停继续改造型。
            </li>
            <li>
              <strong>范围与尺寸：</strong>小八和乌萨奇保留 v3，在大图与小图中核对整组形象。
            </li>
          </ul>
        </div>
        <div className="cs-references">
          <h2>绘制参考</h2>
          <p>参照官方角色图与作者教程进行本库候选绘制，不是官方素材或官方比例规范。</p>
          <a href="https://www.anime-chiikawa.jp/chara.html" target="_blank" rel="noreferrer">
            官方角色图 <ArrowUpRight size={14} aria-hidden="true" />
          </a>
          <a href="https://www.hitogawa.com/chii/chiikakikata/" target="_blank" rel="noreferrer">
            hitogawa · 吉伊绘制步骤 <ArrowUpRight size={14} aria-hidden="true" />
          </a>
          <a href="https://www.hitogawa.com/chii/hachikakikata/" target="_blank" rel="noreferrer">
            hitogawa · 小八绘制步骤 <ArrowUpRight size={14} aria-hidden="true" />
          </a>
          <a href="https://www.hitogawa.com/chii/usagikakikata/" target="_blank" rel="noreferrer">
            hitogawa · 乌萨奇绘制步骤 <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </section>
    </div>
  );
}
