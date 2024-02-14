import { Box } from "@mui/material";
import { DatePicker, Select } from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useTitle } from "react-use";
import styled from "styled-components";
import { useAccount } from "wagmi";

import Header from "../components/category/Header";
import Button from "../components/theme/Button";
import Footer from "../components/theme/Footer";
import Textbox from "../components/theme/Textbox";
import { PaddedWrapper, PageWrapper } from "../components/theme/Theme";
import { SUBTITLE } from "../constants";
import { useAuth } from "../context/AuthContext";
import { useDefaultProfile } from "../hooks/api/profile";
import { useCreateCompetition } from "../hooks/combined/competitions/create";

const FormContainer = styled.div`
  width: 70%;
`;

const FormLabel = styled.p`
  margin-bottom: 0px;
  margin-left: 8px;
  color: ${(props) => props.theme.textColor};
  font-size: 0.9em;
`;

const FormTextbox = styled(Textbox)`
  width: 100%;
  font-size: 14px;
`;

const CompetitionIconWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const CompetitionIcon = styled.img`
  display: block;
  max-width: 69px;
  max-height: 69px;
  width: auto;
  height: auto;
  margin-right: 10px;
  padding-left: 8px;
`;

const DropModal = styled(Box)`
  width: 98%;
  margin: 5px auto;
  text-align: center;
  border-width: 2px;
  border-radius: 16px;
  border-color: gray;
  border-style: dashed;
  background-color: ${(props) => props.theme.backgroundModal};
  cursor: pointer;
`;

const CreateButton = styled(Button)`
  width: 100%;
  margin-top: 10px;
  margin-left: 5px;
`;

const StyledPicker = styled(DatePicker)`
  background-color: transparent;
  margin: 5px;
  width: 100%;
  border-width: 2px;
  border-color: ${(props) => props.theme.borderColor} !important;
  border-radius: 16px;
  padding: 12px;
  padding-left: 20px;

  input {
    font-family: "Nunito", sans-serif;
    color: ${(props) => props.theme.textColor} !important;
    ::placeholder {
      color: ${(props) => props.theme.lightTextColor} !important;
    }
  }
`;

const MemesterSelect = styled(Select)`
  width: 100%;
  color: ${(props) => props.theme.textColor} !important;
  padding: 6px;
  border: 2px solid;
  border-color: ${(props) => props.theme.borderColor} !important;
  border-radius: 16px;
  margin: 5px;

  .ant-select-selector {
    background-color: transparent !important;
    width: 100%;
    color: ${(props) => props.theme.textColor} !important;
    border: none !important;
  }

  .ant-select-selection-item {
    color: ${(props) => props.theme.textColor} !important;
  }

  * {
    color: ${(props) => props.theme.textColor} !important;
  }
`;

const format = "HH:mm";

function CreateCompetition(): JSX.Element {
  const navigate = useNavigate();
  useTitle(`Create a Competition ${SUBTITLE}`);

  const { address } = useAccount();
  const { isAuthenticated } = useAuth(address);
  const { defaultProfile } = useDefaultProfile(address);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [endDate, setEndDate] = useState<Dayjs | undefined>(undefined);
  const [icon, setIcon] = useState<File | undefined>();

  const [competitionType, setCompetitionType] = useState(import.meta.env.VITE_JUDGE_COMPETITION_ADDRESS);

  const { start, loading, competitionId } = useCreateCompetition(
    address,
    endDate?.unix(),
    name,
    description,
    defaultProfile?.id,
    address,
    icon,
    competitionType,
  );

  useEffect(() => {
    if (competitionId) {
      toast.success("Competition created successfully!");
      navigate(`/competition/${competitionId}`);
    }
  }, [competitionId]);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
  });

  useEffect(() => {
    if (acceptedFiles.length) {
      setIcon(acceptedFiles[0]);
    }
  }, [acceptedFiles]);

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    // Can not select days before today
    return current && current < dayjs().startOf("day");
  };

  const onDateOk = (value: Dayjs): void => {
    if (value) {
      setEndDate(value);
    }
  };

  const onCompetitionTypeChange = (value: unknown): void => {
    setCompetitionType(value as string);
  };

  return (
    <PageWrapper>
      <Header supertitle={`Let's compete`} title="Host a Meme Competition" />

      <PaddedWrapper>
        <FormContainer>
          <FormLabel>Competition Title</FormLabel>
          <FormTextbox
            onChange={(e) => {
              setName(e.target.value);
            }}
            maxLength={30}
            placeholder="Competition Title"></FormTextbox>

          <FormLabel>Competition Description</FormLabel>
          <FormTextbox
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            maxLength={100}
            variant="textarea"
            placeholder="Competition Description"></FormTextbox>

          <FormLabel>When does your competition end?</FormLabel>

          <StyledPicker
            placeholder="Select date and time"
            disabledDate={disabledDate}
            showTime={{
              defaultValue: dayjs("00:00", format),
              format,
            }}
            format="YYYY-MM-DD HH:mm"
            showSecond={false}
            allowClear={false}
            onOk={onDateOk}
          />

          <FormLabel>When kind of competition do you want to use?</FormLabel>

          <MemesterSelect
            value={competitionType}
            onChange={onCompetitionTypeChange}
            options={[
              {
                value: import.meta.env.VITE_JUDGE_COMPETITION_MULTIPLE_WINNERS_ADDRESS,
                label: "Judge Competition Multiple Winners",
              },
              { value: import.meta.env.VITE_JUDGE_COMPETITION_ADDRESS, label: "Judge Competition Single Winner" },
            ]}
          />

          <FormLabel>Competition Icon (1:1 ratio and transparent background recommended)</FormLabel>
          <CompetitionIconWrapper>
            {icon && <CompetitionIcon src={icon instanceof Blob ? URL.createObjectURL(icon) : icon} />}
            <DropModal {...getRootProps({ className: "dropzone" })}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop an image or click here</p>
            </DropModal>
          </CompetitionIconWrapper>

          <CreateButton
            disabled={
              !address || !isAuthenticated || name.length === 0 || description.length === 0 || !endDate || loading
            }
            onClick={() => {
              if (start) {
                start();
              } else {
                toast.error("Cannot create competition");
              }
            }}
            variant="colored"
            loading={loading}>
            Host Competition
          </CreateButton>
        </FormContainer>
      </PaddedWrapper>

      <PaddedWrapper>
        <Footer />
      </PaddedWrapper>

      <Helmet>
        <meta property="og:title" content="Host a meme competition on memester" />
        <meta property="og:image" content="https://memester.xyz/android-chrome-512x512.png" />
      </Helmet>
    </PageWrapper>
  );
}

export default CreateCompetition;
