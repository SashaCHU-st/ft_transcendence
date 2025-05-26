import React from "react";
import BotCard from "./BotCard";
import { bots } from "./types/botsData";

interface BotSelectorProps {
	selectedBot: (typeof bots)[0] | null;
	setSelectedBot: (bot: (typeof bots)[0]) => void;
}

const BotSelector: React.FC<BotSelectorProps> = ({ selectedBot, setSelectedBot }) => {
	return (
		<div
			className={`
        bg-gray-900
        bg-opacity-70
        w-full
        flex
        flex-col
        text-center
        pt-2
        px-4
        pb-5
        mt-4
      `}
		/* Main container: Creates a semi-transparent dark background for the bot selector with centered content */
		>
			<p
				className={`
          text-lg
          text-purple-400
          font-extrabold
		  font-orbitron
          uppercase
          tracking-wide
          drop-shadow-[0_0_8px_white]
        `}
			/* Title: Styles the heading text to highlight the bot selection prompt */
			>
				Fighters — Choose Your Opponent!
			</p>
			<div
				className={`
          pt-2
        `}
			/* Bot grid wrapper: Adds top padding to separate the title from the bot cards */
			>
				<div
					className={`
            grid
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            xl:grid-cols-5
            gap-3
            w-full
            px-2
            sm:px-4
          `}
				/* Bot grid: Arranges bot cards in a responsive grid layout with varying columns by screen size */
				>
					{bots.map((bot, idx) => (
						<BotCard
							key={idx}
							{...bot}
							onSelect={() => setSelectedBot(bot)}
							selected={selectedBot?.image === bot.image}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default BotSelector;