import {
  Button,
  Center,
  Container,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getIsLoggedIn } from "../../redux/slices/User";
import { IconLink } from "@tabler/icons-react";

const Home = () => {
  const isLoggedIn = useSelector(getIsLoggedIn);
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#eef2ff",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        padding: "2rem 0",
      }}
    >
      <Container size="sm" style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            backdropFilter: "blur(20px)",
            background: "rgba(255, 255, 255, 0.95)",
            border: "1px solid rgba(148, 163, 184, 0.25)",
            borderRadius: "30px",
            padding: "3rem 2rem",
            boxShadow: "0 8px 40px rgba(148, 163, 184, 0.2)",
            textAlign: "center",
          }}
        >
          <Center>
            <IconLink size={48} color="#4f46e5" />
          </Center>


          <Text
            size="xl"
            fw={700}
            style={{
              color: "#0f172a",
              marginTop: "0.8rem",
              marginBottom: "1.5rem",
              fontWeight: 400,
            }}
          >
            Shorten Your Links, Expand Your Reach
          </Text>

          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.92)",
              padding: "1.5rem",
              borderRadius: "20px",
              marginTop: "1rem",
              marginBottom: "2rem",
              border: "1px solid rgba(148, 163, 184, 0.25)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Text
              style={{
                color: "#334155",
                fontSize: "1rem",
                fontStyle: "italic",
                lineHeight: "1.8",
                marginBottom: "0.8rem",
              }}
            >
              "In a world of endless information, simplicity is power. Transform your long URLs into shareable moments."
            </Text>
            
            <Text
              style={{
                color: "#475569",
                fontSize: "0.9rem",
                marginBottom: "1rem",
              }}
            >
              Every link tells a story. Make it count.
            </Text>

            <div
              style={{
                display: "flex",
                gap: "8px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  backgroundColor: "rgba(241, 245, 249, 0.95)",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "20px",
                  color: "#0f172a",
                  fontSize: "0.85rem",
                  border: "1px solid rgba(148, 163, 184, 0.3)",
                }}
              >
                ✨ Quick & Easy
              </span>
              <span
                style={{
                  backgroundColor: "rgba(241, 245, 249, 0.95)",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "20px",
                  color: "#0f172a",
                  fontSize: "0.85rem",
                  border: "1px solid rgba(148, 163, 184, 0.3)",
                }}
              >
                📊 Track Analytics
              </span>
              <span
                style={{
                  backgroundColor: "rgba(241, 245, 249, 0.95)",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "20px",
                  color: "#0f172a",
                  fontSize: "0.85rem",
                  border: "1px solid rgba(148, 163, 184, 0.3)",
                }}
              >
                🔗 Custom URLs
              </span>
            </div>
          </div>

          <Button
            size="md"
            radius="xl"
            variant="gradient"
            gradient={{ from: "grape", to: "indigo" }}
            onClick={() =>
              isLoggedIn ? navigate("/shorten") : navigate("/login")
            }
            style={{
              fontWeight: 700,
              fontSize: "1rem",
              boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
            }}
          >
            Get Started
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default Home;
