import path from '@/assets/memory-placeholder.jpg';
import cafe from '@/assets/memory-cafe.jpg';
import garden from '@/assets/memory-garden.jpg';
import melody from '@/assets/pallavi-melody.mp3.asset.json';

/** Replace images here, or use the little Customize panel in the experience for a browser preview. */
export const storyConfig = {
  names: { to: 'Pallavi', from: 'Hakim' },
  date: '21 November',
  dateMeaning: 'The day our forever begins.',
  memories: [
    { image: path, caption: 'Our first moments' },
    { image: cafe, caption: 'That smile ❤️' },
    { image: garden, caption: 'Us being silly' },
    { image: path, caption: 'Another day I fell for you' },
    { image: cafe, caption: 'Just us' },
    { image: garden, caption: "Forever wouldn't be enough" },
  ],
  puzzleImage: garden,
  music: melody.url,
  videos: [] as string[],
  letter: `My love,\n\nIt's funny how our story started.\n\nTwo people who didn't even know each other...\nand somehow became each other's favorite person.\n\nWe didn't start with a perfect story.\nWe had misunderstandings.\nWe had fights.\nWe annoyed each other.\nWe sometimes didn't understand each other.\n\nBut somehow, after every fight,\nwe found our way back to each other.\nAnd every time we did,\nI loved you a little more.\n\nYou became my happiness,\nmy comfort,\nmy favorite person,\nand the person I want beside me for the rest of my life.\n\nThank you for choosing me.\nThank you for loving me.\nAnd thank you for being my Pallavi. ❤️\n\nI don't promise that our life will always be perfect.\nBut I promise that I'll keep choosing you,\nkeep annoying you,\nkeep making you laugh,\nkeep fighting with you,\nand keep loving you...\nfor the rest of my life.\n\nI love you, my baby.\n\nForever yours,\nHakim ❤️`,
};
