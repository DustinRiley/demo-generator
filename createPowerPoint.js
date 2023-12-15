import officegen from 'officegen';
import fs from 'fs';

function parseInputText(text) {
  const slides = [];
  const slideSections = text.split(/\d+\.\s+(?:Introduction|Goal|Issue) Slide[s]?:\n/).slice(1);

  slideSections.forEach(section => {
    const matches = section.match(/Title: '([^']+)'\s+- Subtitle: '([^']+)'\s+(?:- Description: '([^']+)')?/g);

    if (matches) {
      matches.forEach(match => {
        const [, title, subtitle, description] = match.match(/Title: '([^']+)'\s+- Subtitle: '([^']+)'\s*(?:- Description: '([^']+)')?/);
        slides.push({ title, subtitle, description });
      });
    }
  });

  return slides;
}

const createSlide = (pptx, slideData) => {
  const { title, subtitle, description } = slideData;

  let slide = pptx.makeNewSlide();

  slide.addText(title, {
    x: 50,
    y: 50,
    cx: 860,
    cy: 100,
    font_size: 24,
    font_face: 'Arial',
    color: '000000'
  });

  slide.addText(subtitle, {
    x: 50,
    y: 150,
    cx: 860,
    cy: 100,
    font_size: 18,
    font_face: 'Arial',
    color: '333333'
  });

  slide.addText(description, {
    x: 50,
    y: 250,
    cx: 860,
    cy: 200,
    font_size: 14,
    font_face: 'Arial',
    color: '666666'
  });
};

const createPowerPoint = (inputText) => {

  let pptx = officegen('pptx');

  const slidesData = parseInputText(inputText);
  slidesData.forEach(slideData => createSlide(pptx, slideData));

  const out = fs.createWriteStream('sprint_demo_presentation.pptx');

  out.on('error', function (err) {
    console.log(err);
  });

  pptx.generate(out);
}
export default createPowerPoint;