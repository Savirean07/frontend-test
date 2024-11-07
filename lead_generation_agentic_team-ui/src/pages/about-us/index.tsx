const AboutUs = () => {
  return (
    <div className="min-h-screen py-44 mx-auto max-w-7xl font-cascade">
      <div>
        <h1 className="text-5xl font-bold relative text-blue-500 before:absolute before:w-20 before:h-1 before:animate-slide-up before:bg-blue-500 before:rounded-full before:left-1.5 before:-bottom-3 after:absolute after:w-1 after:h-1 after:animate-slide-up after:bg-blue-500 after:rounded-full after:left-24 after:-bottom-3">
          Who we are ?
        </h1>
        <h2 className="text-2xl font-bold mt-10">
          We are a team of passionate innovators who love to build amazing
          things.
        </h2>
        <p className="text-xl text-gray-500 mt-4">
          Welcome to Wintellisys, where innovation meets intelligence. We are a
          team specializing in cutting-edge technologies and AI models that
          cater to a diverse range of needs, from blog writing and market
          research to customized solutions guided by your specifications. At
          Wintellisys, we harness the power of advanced AI technologies to
          empower businesses and individuals.
        </p>
      </div>
      <div className="mt-20">
        <h2 className="text-2xl font-bold">Our Expertise</h2>
        <ul className="ml-8 mt-6 list-decimal *:my-4 *:text-gray-500">
          <li className="text-xl">
            <strong>AI-Driven Blog Writing:</strong> Our AI models excel in
            creating compelling and informative content across various
            industries. Whether you need engaging blog posts, technical
            articles, or SEO-optimized content, our team ensures high-quality
            output that resonates with your audience.
          </li>
          <li className="text-xl">
            <strong>Market Research:</strong> Leveraging AI capabilities, we
            conduct in-depth market research tailored to your specific
            requirements. From trend analysis to consumer behavior insights, our
            research provides valuable data-driven perspectives to guide your
            strategic decisions.
          </li>
          <li className="text-xl">
            <strong>Customized Solutions:</strong> Our AI models are flexible
            and adaptable, capable of generating customized solutions that meet
            your unique needs. Whether you need a specific report, a tailored
            analysis, or a custom tool, we can tailor our AI models to fit your
            requirements.
          </li>
        </ul>
      </div>
      <div className="mt-20">
        <h1 className="text-5xl font-bold relative text-blue-500 before:absolute before:w-20 before:h-1 before:animate-slide-up before:bg-blue-500 before:rounded-full before:left-1.5 before:-bottom-3 after:absolute after:w-1 after:h-1 after:animate-slide-up after:bg-blue-500 after:rounded-full after:left-24 after:-bottom-3">
          Why Choose LeadGen Wingman?
        </h1>
      </div>
      <div className="mt-20">
        <ul className="ml-8 mt-6 list-decimal *:my-4 *:text-gray-500">
          <li className="text-xl">
            <strong>Cutting-Edge Innovation:</strong> At Wintellisys, we're
            at the forefront of AI-driven lead generation, constantly improving
            our tools to deliver the most advanced solutions. From
            multi-platform lead scraping to personalized cold email writing, our
            technology evolves with your business needs.
          </li>
          <li className="text-xl">
            <strong>Industry Expertise:</strong> Our team consists of
            experienced professionals with deep expertise in AI and lead
            generation. You can count on us for reliable performance and
            impactful results that help you grow your business.
          </li>
          <li className="text-xl">
            <strong>Client-Focused Solutions:</strong> We take the time to
            understand your unique goals and challenges. Whether you're
            targeting specific industries, job titles, or locations, our
            solutions are tailored to meet your objectives and drive measurable
            success for your business.
          </li>
        </ul>
      </div>
      <div className="mt-20">
        <h1 className="text-5xl font-bold relative text-blue-500 before:absolute before:w-20 before:h-1 before:animate-slide-up before:bg-blue-500 before:rounded-full before:left-1.5 before:-bottom-3 after:absolute after:w-1 after:h-1 after:animate-slide-up after:bg-blue-500 after:rounded-full after:left-24 after:-bottom-3">
          Our Team's
        </h1>
        <ul className="mt-20 flex gap-4 overflow-auto scrollbar-hidden">
          {[
            {
              name: "Founder - Chris Wess",
              image: "./image/1607525842202.jpeg",
            },
            {
              name: "LeadGen Wingman",
              image:
                "https://images.pexels.com/photos/2505026/pexels-photo-2505026.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            },
          ].map((item, index) => (
            <li
              style={{
                backgroundImage: `url(${item.image})`,
              }}
              key={index}
              className="flex items-center justify-center h-56 aspect-video bg-gray-500 rounded-lg bg-cover bg-top relative"
            >
              <div className="absolute bottom-0 w-full h-10 bg-gradient-to-t to-transparent from-black/50 flex items-center justify-start px-4">
                {index === 0 ? (
                  <p className="text-white text-2xl font-bold">
                    Founder - Chris Wess
                  </p>
                ) : (
                  <p className="text-white text-2xl font-bold">{item.name}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AboutUs;
