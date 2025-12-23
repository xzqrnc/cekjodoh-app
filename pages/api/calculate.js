function countLetters(str) {
  const clean = str.toLowerCase().replace(/[^a-z]/g, '');
  const counts = {};
  for (const char of clean) {
    counts[char] = (counts[char] || 0) + 1;
  }
  return counts;
}

function reduceToSingle(numbers) {
  let arr = [...numbers];
  while (arr.length > 1) {
    const newArr = [];
    for (let i = 0; i < arr.length; i += 2) {
      if (i + 1 < arr.length) {
        let sum = arr[i] + arr[i + 1];
        if (sum >= 10) {
          sum = Math.floor(sum / 10) + (sum % 10);
        }
        newArr.push(sum);
      } else {
        newArr.push(arr[i]);
      }
    }
    arr = newArr;
  }
  return arr[0] * 10 + (arr.length > 1 ? arr[1] : 0); // gabung jadi 2 digit
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { nama1, nama2 } = req.body;
  const fullName = `${nama1} ${nama2}`;
  const counts = countLetters(fullName);

  const values = Object.values(counts).sort((a, b) => b - a);
  
  // Jika tidak ada huruf, return 00
  if (values.length === 0) {
    return res.status(200).json({ result: '00' });
  }

  const finalNumber = reduceToSingle(values);
  const result = finalNumber.toString().padStart(2, '0');

  res.status(200).json({ result });
}
