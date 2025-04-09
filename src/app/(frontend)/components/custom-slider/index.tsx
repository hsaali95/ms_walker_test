import React from "react";
import Carousel from "react-material-ui-carousel";

// Define the props type

interface CustomCarouselProps {
  children?: React.ReactNode;
}

const CustomCarousel: React.FC<CustomCarouselProps> = ({ children }) => {
  return (
    <Carousel
      indicators={true}
      autoPlay={false}
      animation="slide"
      navButtonsAlwaysVisible={true}
      duration={500}
      sx={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}
      navButtonsProps={{
        style: {
          backgroundColor: "#4F131F", // Button background color
          color: "#fff", // Arrow color
          borderRadius: "50%", // Make it circular
          padding: "10px", // Increase button size
        },
      }}
      navButtonsWrapperProps={{
        style: {
          top: "50%", // Center buttons vertically
          transform: "translateY(-50%)",
        },
      }}
      indicatorIconButtonProps={{
        style: {
          //   color: "#4F131F", // Default non active bg  dot color (brown)
        },
      }}
      activeIndicatorIconButtonProps={{
        style: {
          color: "#4F131F", // Default dot color (brown)
        },
      }}
    >
      {children}
    </Carousel>
  );
};

export default CustomCarousel;
