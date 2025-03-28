import moment from "moment";
import "moment/locale/id";
import { useRouter } from "next/router";

import Heading from "@/components/atoms/Typography/Heading";
import Paragraph from "@/components/atoms/Typography/Paragraph";

import DefaultBackgound from "../../../assets/images/default_image_information.webp";

const CardInformation = ({ announcement }) => {
  const router = useRouter();

  return (
    <div
      className="flex cursor-pointer space-x-4"
      onClick={() =>
        router.push(`/beranda/announcement-event/${announcement.id}`)
      }
    >
      <img
        src={announcement.heroImage || DefaultBackgound.src}
        alt={announcement.title}
        className="h-auto w-[92px] max-w-md rounded-md object-cover"
      />
      <div className="flex flex-col gap-y-3">
        <Heading
          level={5}
          className="line-clamp-2 font-semibold text-[#363636]"
        >
          {announcement.title}
        </Heading>
        <Paragraph level={4} className="text-green8">
          {announcement.type}
        </Paragraph>
        <Paragraph level={4} className="text-blue8">
          Diterbitkan{" "}
          {moment.utc(announcement.createdAt).format("DD MMMM YYYY")}
        </Paragraph>
      </div>
    </div>
  );
};

export default CardInformation;
