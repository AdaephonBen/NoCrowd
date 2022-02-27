import cv2
import numpy as np 
import argparse
import time

parser = argparse.ArgumentParser()
parser.add_argument('--video_path', help="Path of video file", default="videos/car_on_road.mp4")
parser.add_argument('--verbose', help="To print statements", default=True)
args = parser.parse_args()

def load_yolo():
	net = cv2.dnn.readNet("yolov3.weights", "yolov3.cfg")
	classes = []
	with open("coco.names", "r") as f:
		classes = [line.strip() for line in f.readlines()] 
	
	output_layers = [layer_name for layer_name in net.getUnconnectedOutLayersNames()]
	colors = np.random.uniform(0, 255, size=(len(classes), 3))
	return net, classes, colors, output_layers

def display_blob(blob):
	for b in blob:
		for n, imgb in enumerate(b):
			cv2.imshow(str(n), imgb)

def detect_objects(img, net, outputLayers):			
	blob = cv2.dnn.blobFromImage(img, scalefactor=0.00392, size=(320, 320), mean=(0, 0, 0), swapRB=True, crop=False)
	net.setInput(blob)
	outputs = net.forward(outputLayers)
	return blob, outputs

def get_box_dimensions(outputs, height, width):
	boxes = []
	confs = []
	class_ids = []
	for output in outputs:
		for detect in output:
			scores = detect[5:]
			class_id = np.argmax(scores)
			conf = scores[class_id]
			if conf > 0.3:
				center_x = int(detect[0] * width)
				center_y = int(detect[1] * height)
				w = int(detect[2] * width)
				h = int(detect[3] * height)
				x = int(center_x - w/2)
				y = int(center_y - h / 2)
				boxes.append([x, y, w, h])
				confs.append(float(conf))
				class_ids.append(class_id)
	return boxes, confs, class_ids
			
def draw_labels(boxes, confs, colors, class_ids, classes, img): 
	indexes = cv2.dnn.NMSBoxes(boxes, confs, 0.5, 0.4)
	font = cv2.FONT_HERSHEY_PLAIN
	count = 0
	for i in range(len(boxes)):
		if i in indexes:
			x, y, w, h = boxes[i]
			label = str(classes[class_ids[i]])
			# print(class_ids[i])
			color = colors[i]
			cv2.rectangle(img, (x,y), (x+w, y+h), color, 2)
			cv2.putText(img, label, (x, y - 5), font, 1, color, 1)
			if class_ids[i] == 0:
				count += 1
	return count

def start_video(video_path):
	model, classes, colors, output_layers = load_yolo()
	cap = cv2.VideoCapture(video_path)
	final_list = []
	i = 0
	list1= []
	ret , frame = cap.read()
	while True:		
		if( i != 25):
			ret , frame = cap.read()
			if(ret == True):
				height, width, channels = frame.shape
				blob, outputs = detect_objects(frame, model, output_layers)
				boxes, confs, class_ids = get_box_dimensions(outputs, height, width)
				count = draw_labels(boxes, confs, colors, class_ids, classes, frame)
				list1.append(count)
				key = cv2.waitKey(1)
				i += 1
				if key == 27:
					break
			else:
				break
		else:
			i = 0
			number_of_people = int(sum(list1)/len(list1))
			print(number_of_people)
			final_list.append(number_of_people)
			list1.clear()
	cap.release()
	return final_list

if __name__ == '__main__':
	video_path = args.video_path
	if args.verbose:
		print('Opening '+video_path+" .... ")
	final_list = start_video(video_path)
	print(final_list)
	file1 = open("output.txt","w")
	for i in range(len(final_list)):
		file1.write(str(final_list[i])+"\n")
	cv2.destroyAllWindows()
