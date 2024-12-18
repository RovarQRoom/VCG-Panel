export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	public: {
		Tables: {
			Card: {
				Row: {
					created_at: string;
					deleted_at: string | null;
					description: number | null;
					icon: string | null;
					id: number;
					link: string | null;
					title: number;
				};
				Insert: {
					created_at?: string;
					deleted_at?: string | null;
					description?: number | null;
					icon?: string | null;
					id?: number;
					link?: string | null;
					title: number;
				};
				Update: {
					created_at?: string;
					deleted_at?: string | null;
					description?: number | null;
					icon?: string | null;
					id?: number;
					link?: string | null;
					title?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'Card_description_fkey';
						columns: ['description'];
						isOneToOne: false;
						referencedRelation: 'Language';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Card_title_fkey';
						columns: ['title'];
						isOneToOne: false;
						referencedRelation: 'Language';
						referencedColumns: ['id'];
					}
				];
			};
			Carousel: {
				Row: {
					created_at: string;
					deleted_at: string | null;
					description: number | null;
					id: number;
					media: number | null;
					thumbnail_video: string | null;
					title: number;
				};
				Insert: {
					created_at?: string;
					deleted_at?: string | null;
					description?: number | null;
					id?: number;
					media?: number | null;
					thumbnail_video?: string | null;
					title: number;
				};
				Update: {
					created_at?: string;
					deleted_at?: string | null;
					description?: number | null;
					id?: number;
					media?: number | null;
					thumbnail_video?: string | null;
					title?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'Carousel_description_fkey';
						columns: ['description'];
						isOneToOne: false;
						referencedRelation: 'Language';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Carousel_media_fkey';
						columns: ['media'];
						isOneToOne: false;
						referencedRelation: 'Language';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Carousel_title_fkey';
						columns: ['title'];
						isOneToOne: false;
						referencedRelation: 'Language';
						referencedColumns: ['id'];
					}
				];
			};
			Event: {
				Row: {
					created_at: string;
					date: string;
					deleted_at: string | null;
					id: number;
					place: number;
					ticket: string | null;
				};
				Insert: {
					created_at?: string;
					date: string;
					deleted_at?: string | null;
					id?: number;
					place: number;
					ticket?: string | null;
				};
				Update: {
					created_at?: string;
					date?: string;
					deleted_at?: string | null;
					id?: number;
					place?: number;
					ticket?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'Event_place_fkey';
						columns: ['place'];
						isOneToOne: false;
						referencedRelation: 'Language';
						referencedColumns: ['id'];
					}
				];
			};
			Footer: {
				Row: {
					created_at: string;
					deleted_at: string | null;
					emails: string[] | null;
					id: number;
					phones: string[];
				};
				Insert: {
					created_at?: string;
					deleted_at?: string | null;
					emails?: string[] | null;
					id?: number;
					phones: string[];
				};
				Update: {
					created_at?: string;
					deleted_at?: string | null;
					emails?: string[] | null;
					id?: number;
					phones?: string[];
				};
				Relationships: [];
			};
			Heading: {
				Row: {
					created_at: string;
					deleted_at: string | null;
					heading_type: Database['public']['Enums']['HeadingEnum'];
					id: number;
					title: number | null;
				};
				Insert: {
					created_at?: string;
					deleted_at?: string | null;
					heading_type: Database['public']['Enums']['HeadingEnum'];
					id?: number;
					title?: number | null;
				};
				Update: {
					created_at?: string;
					deleted_at?: string | null;
					heading_type?: Database['public']['Enums']['HeadingEnum'];
					id?: number;
					title?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'Heading_title_fkey';
						columns: ['title'];
						isOneToOne: false;
						referencedRelation: 'Language';
						referencedColumns: ['id'];
					}
				];
			};
			Language: {
				Row: {
					ar: string | null;
					ckb: string;
					created_at: string;
					deleted_at: string | null;
					en: string | null;
					id: number;
				};
				Insert: {
					ar?: string | null;
					ckb: string;
					created_at?: string;
					deleted_at?: string | null;
					en?: string | null;
					id?: number;
				};
				Update: {
					ar?: string | null;
					ckb?: string;
					created_at?: string;
					deleted_at?: string | null;
					en?: string | null;
					id?: number;
				};
				Relationships: [];
			};
			Option: {
				Row: {
					created_at: string;
					deleted_at: string | null;
					disabled: boolean;
					field: string | null;
					id: number;
					setting: number | null;
				};
				Insert: {
					created_at?: string;
					deleted_at?: string | null;
					disabled?: boolean;
					field?: string | null;
					id?: number;
					setting?: number | null;
				};
				Update: {
					created_at?: string;
					deleted_at?: string | null;
					disabled?: boolean;
					field?: string | null;
					id?: number;
					setting?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'Option_setting_fkey';
						columns: ['setting'];
						isOneToOne: false;
						referencedRelation: 'Setting';
						referencedColumns: ['id'];
					}
				];
			};
			Register: {
				Row: {
					action: boolean | null;
					callTime: Database['public']['Enums']['CallTime'] | null;
					created_at: string;
					deleted_at: string | null;
					email: string | null;
					goal_income: string | null;
					id: number;
					language: Database['public']['Enums']['LanguageEnum'] | null;
					monthly_income: string | null;
					name: string | null;
					phone: string | null;
					service: Database['public']['Enums']['Service'] | null;
					trade_priority: boolean | null;
					traded_before: boolean | null;
					trading_from: string | null;
					trading_knowledge: Database['public']['Enums']['Knowledge'] | null;
				};
				Insert: {
					action?: boolean | null;
					callTime?: Database['public']['Enums']['CallTime'] | null;
					created_at?: string;
					deleted_at?: string | null;
					email?: string | null;
					goal_income?: string | null;
					id?: number;
					language?: Database['public']['Enums']['LanguageEnum'] | null;
					monthly_income?: string | null;
					name?: string | null;
					phone?: string | null;
					service?: Database['public']['Enums']['Service'] | null;
					trade_priority?: boolean | null;
					traded_before?: boolean | null;
					trading_from?: string | null;
					trading_knowledge?: Database['public']['Enums']['Knowledge'] | null;
				};
				Update: {
					action?: boolean | null;
					callTime?: Database['public']['Enums']['CallTime'] | null;
					created_at?: string;
					deleted_at?: string | null;
					email?: string | null;
					goal_income?: string | null;
					id?: number;
					language?: Database['public']['Enums']['LanguageEnum'] | null;
					monthly_income?: string | null;
					name?: string | null;
					phone?: string | null;
					service?: Database['public']['Enums']['Service'] | null;
					trade_priority?: boolean | null;
					traded_before?: boolean | null;
					trading_from?: string | null;
					trading_knowledge?: Database['public']['Enums']['Knowledge'] | null;
				};
				Relationships: [];
			};
			Representative: {
				Row: {
					created_at: string;
					deleted_at: string | null;
					description: number | null;
					id: number;
					image: string | null;
					name: number | null;
				};
				Insert: {
					created_at?: string;
					deleted_at?: string | null;
					description?: number | null;
					id?: number;
					image?: string | null;
					name?: number | null;
				};
				Update: {
					created_at?: string;
					deleted_at?: string | null;
					description?: number | null;
					id?: number;
					image?: string | null;
					name?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'Representative_description_fkey';
						columns: ['description'];
						isOneToOne: false;
						referencedRelation: 'Language';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Representative_name_fkey';
						columns: ['name'];
						isOneToOne: false;
						referencedRelation: 'Language';
						referencedColumns: ['id'];
					}
				];
			};
			Route: {
				Row: {
					created_at: string;
					deleted_at: string | null;
					disabled: boolean;
					icon: string | null;
					id: number;
					link: string;
					name: number;
				};
				Insert: {
					created_at?: string;
					deleted_at?: string | null;
					disabled?: boolean;
					icon?: string | null;
					id?: number;
					link: string;
					name: number;
				};
				Update: {
					created_at?: string;
					deleted_at?: string | null;
					disabled?: boolean;
					icon?: string | null;
					id?: number;
					link?: string;
					name?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'Route_name_fkey';
						columns: ['name'];
						isOneToOne: false;
						referencedRelation: 'Language';
						referencedColumns: ['id'];
					}
				];
			};
			Setting: {
				Row: {
					created_at: string;
					deleted_at: string | null;
					id: number;
					route: number | null;
				};
				Insert: {
					created_at?: string;
					deleted_at?: string | null;
					id?: number;
					route?: number | null;
				};
				Update: {
					created_at?: string;
					deleted_at?: string | null;
					id?: number;
					route?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'Setting_route_fkey';
						columns: ['route'];
						isOneToOne: true;
						referencedRelation: 'Route';
						referencedColumns: ['id'];
					}
				];
			};
			Social: {
				Row: {
					created_at: string;
					deleted_at: string | null;
					footer: number | null;
					icon: string | null;
					id: number;
					link: string;
					name: string;
				};
				Insert: {
					created_at?: string;
					deleted_at?: string | null;
					footer?: number | null;
					icon?: string | null;
					id?: number;
					link: string;
					name: string;
				};
				Update: {
					created_at?: string;
					deleted_at?: string | null;
					footer?: number | null;
					icon?: string | null;
					id?: number;
					link?: string;
					name?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'Social_footer_fkey';
						columns: ['footer'];
						isOneToOne: false;
						referencedRelation: 'Footer';
						referencedColumns: ['id'];
					}
				];
			};
			Ticket: {
				Row: {
					created_at: string;
					deleted_at: string | null;
					icon: string | null;
					id: number;
					title: number;
				};
				Insert: {
					created_at?: string;
					deleted_at?: string | null;
					icon?: string | null;
					id?: number;
					title: number;
				};
				Update: {
					created_at?: string;
					deleted_at?: string | null;
					icon?: string | null;
					id?: number;
					title?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'Ticket_title_fkey';
						columns: ['title'];
						isOneToOne: false;
						referencedRelation: 'Language';
						referencedColumns: ['id'];
					}
				];
			};
			User: {
				Row: {
					auth: string | null;
					created_at: string;
					deleted_at: string | null;
					email: string | null;
					id: number;
					image: string | null;
					name: string | null;
				};
				Insert: {
					auth?: string | null;
					created_at?: string;
					deleted_at?: string | null;
					email?: string | null;
					id?: number;
					image?: string | null;
					name?: string | null;
				};
				Update: {
					auth?: string | null;
					created_at?: string;
					deleted_at?: string | null;
					email?: string | null;
					id?: number;
					image?: string | null;
					name?: string | null;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			CallTime: 'AM11_PM02' | 'PM02_PM05' | 'PM05_PM08';
			HeadingEnum: 'CARD' | 'REPRESENTATIVE';
			Knowledge: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCE';
			LanguageEnum: 'ENGLISH' | 'ARABIC' | 'KURDISH';
			Service: 'LIVE_TRADE' | 'PRICE_PLAY_COURSE';
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (PublicSchema['Tables'] & PublicSchema['Views'])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
				Database[PublicTableNameOrOptions['schema']]['Views'])
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
			Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
		? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
		? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
		? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
		: never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
		? PublicSchema['Enums'][PublicEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof PublicSchema['CompositeTypes']
		| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
		: never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
		? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
		: never;

// Schema: public
// Enums
export enum CallTime {
	AM11_PM02 = 'AM11_PM02',
	PM02_PM05 = 'PM02_PM05',
	PM05_PM08 = 'PM05_PM08'
}

export enum HeadingEnum {
	CARD = 'CARD',
	REPRESENTATIVE = 'REPRESENTATIVE'
}

export enum Knowledge {
	BEGINNER = 'BEGINNER',
	INTERMEDIATE = 'INTERMEDIATE',
	ADVANCE = 'ADVANCE'
}

export enum LanguageEnum {
	ENGLISH = 'ENGLISH',
	ARABIC = 'ARABIC',
	KURDISH = 'KURDISH'
}

export enum Service {
	LIVE_TRADE = 'LIVE_TRADE',
	PRICE_PLAY_COURSE = 'PRICE_PLAY_COURSE'
}

// Tables
export type Card = Database['public']['Tables']['Card']['Row'];
export type InsertCard = Database['public']['Tables']['Card']['Insert'];
export type UpdateCard = Database['public']['Tables']['Card']['Update'];

export type Carousel = Database['public']['Tables']['Carousel']['Row'];
export type InsertCarousel = Database['public']['Tables']['Carousel']['Insert'];
export type UpdateCarousel = Database['public']['Tables']['Carousel']['Update'];

export type Event = Database['public']['Tables']['Event']['Row'];
export type InsertEvent = Database['public']['Tables']['Event']['Insert'];
export type UpdateEvent = Database['public']['Tables']['Event']['Update'];

export type Footer = Database['public']['Tables']['Footer']['Row'];
export type InsertFooter = Database['public']['Tables']['Footer']['Insert'];
export type UpdateFooter = Database['public']['Tables']['Footer']['Update'];

export type Heading = Database['public']['Tables']['Heading']['Row'];
export type InsertHeading = Database['public']['Tables']['Heading']['Insert'];
export type UpdateHeading = Database['public']['Tables']['Heading']['Update'];

export type Language = Database['public']['Tables']['Language']['Row'];
export type InsertLanguage = Database['public']['Tables']['Language']['Insert'];
export type UpdateLanguage = Database['public']['Tables']['Language']['Update'];

export type Option = Database['public']['Tables']['Option']['Row'];
export type InsertOption = Database['public']['Tables']['Option']['Insert'];
export type UpdateOption = Database['public']['Tables']['Option']['Update'];

export type Register = Database['public']['Tables']['Register']['Row'];
export type InsertRegister = Database['public']['Tables']['Register']['Insert'];
export type UpdateRegister = Database['public']['Tables']['Register']['Update'];

export type Representative = Database['public']['Tables']['Representative']['Row'];
export type InsertRepresentative = Database['public']['Tables']['Representative']['Insert'];
export type UpdateRepresentative = Database['public']['Tables']['Representative']['Update'];

export type Route = Database['public']['Tables']['Route']['Row'];
export type InsertRoute = Database['public']['Tables']['Route']['Insert'];
export type UpdateRoute = Database['public']['Tables']['Route']['Update'];

export type Setting = Database['public']['Tables']['Setting']['Row'];
export type InsertSetting = Database['public']['Tables']['Setting']['Insert'];
export type UpdateSetting = Database['public']['Tables']['Setting']['Update'];

export type Social = Database['public']['Tables']['Social']['Row'];
export type InsertSocial = Database['public']['Tables']['Social']['Insert'];
export type UpdateSocial = Database['public']['Tables']['Social']['Update'];

export type Ticket = Database['public']['Tables']['Ticket']['Row'];
export type InsertTicket = Database['public']['Tables']['Ticket']['Insert'];
export type UpdateTicket = Database['public']['Tables']['Ticket']['Update'];

export type User = Database['public']['Tables']['User']['Row'];
export type InsertUser = Database['public']['Tables']['User']['Insert'];
export type UpdateUser = Database['public']['Tables']['User']['Update'];
