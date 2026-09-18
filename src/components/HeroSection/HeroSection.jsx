import React, { useState, useEffect } from 'react'
import Navbar from '../Navbar/Navbar'
import './HeroSection.css'

import banner1 from '../../assets/maison-banners/1.png'
import banner2 from '../../assets/maison-banners/2.png'
import banner3 from '../../assets/maison-banners/3.png'
import banner4 from '../../assets/maison-banners/4.png'


const bannerSlides = [
  { image: banner1, alt: 'Velvet Edit — coming soon' },
  { image: banner2, alt: 'Elegance in Silk' },
  { image: banner3, alt: 'Formal Edit — 2 Pc & 3 Pc' },
  { image: banner4, alt: 'Co-ord Set Edit' },
]

function HeroSection() {
  const [current, setCurrent] = useState(0)

  // Autoplay: change slide every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % bannerSlides.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const goPrev = () => {
    setCurrent((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length)
  }

  const goNext = () => {
    setCurrent((prev) => (prev + 1) % bannerSlides.length)
  }

  return (
    <section className="hero-section relative w-full flex items-center">
      <Navbar />

      {/* Fade Carousel */}
      <div className="hero-carousel relative w-full h-full">
        {bannerSlides.map((slide, index) => (
          <div
            key={index}
            className={`hero-carousel-item ${index === current ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
            role="img"
            aria-label={slide.alt}
          />
        ))}

        {/* Prev button */}
        <button className="hero-carousel-control hero-carousel-prev" onClick={goPrev}>
          &#10094;
        </button>

        {/* Next button */}
        <button className="hero-carousel-control hero-carousel-next" onClick={goNext}>
          &#10095;
        </button>

        {/* Dots */}
        <div className="hero-carousel-dots flex">
          {bannerSlides.map((_, index) => (
            <button
              key={index}
              className={`hero-carousel-dot ${index === current ? 'active' : ''}`}
              onClick={() => setCurrent(index)}
            />
          ))}
        </div>
      </div>

      <div className="hero-text flex flex-col px-6"></div>
    </section>
  )
}

export default HeroSection
